import { Command, Flags } from '@oclif/core'

import { postmanApiInstance } from '../../postman/api'
import { fsWorkspaceManager } from '../../file-system'
import { WorkspaceTypeValues } from '../../postman/api/types'
import { Listr } from 'listr2'
import { PMACWorkspace } from '../../file-system/types'
import { SharedWorkspacesTasksCtx, workspaceSharedTasks } from '../../commands-helpers/shared/workspace-tasks'

export default class WorkspaceSync extends Command {
  static description = 'Unsyncs one of your Postman workspaces that is in sync with pmac, [Warning!] this command does not removes the synced postman workspace.'

  static examples = [
    'pmac workspace unsync',
  ]

  static flags = {
    id: Flags.string({ description: 'workspace id', required: false, helpValue: '<workspace specific id>' }),
    name: Flags.string({ char: 'n', description: 'The exact name of your workspace, on name duplication will pick first match.', required: false, helpValue: '<workspace name>' }),
    type: Flags.enum({ description: 'A specific workspace type, useful in case of duplicate names', required: false, options: WorkspaceTypeValues, helpValue: `<workspace-type: ${WorkspaceTypeValues.join(' | ')}>` }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(WorkspaceSync)

    const fetchPmWorkspacesTask = new Listr<{ pmacWorkspace: PMACWorkspace }>([{
      title: 'Fetching a single chosen workspace',
      task: async (ctx, task) => task.newListr<SharedWorkspacesTasksCtx.TPmacWorkspacesCombinedCtx>([
        workspaceSharedTasks.loadAllPmacWorkspacesTask(),
        workspaceSharedTasks.choosePmacWorkspaceTask(),
      ]),
    }])

    const { pmacWorkspace } = await fetchPmWorkspacesTask.run()

    const unsyncTask = new Listr({
      title: `Unsyncing pmac workspace '${pmacWorkspace.name}' and its resources`,
      task: async (_ctx, task) => {
        const unsyncedPmacWorkspace: PMACWorkspace = {
          ...pmacWorkspace,
          pmacID: pmacWorkspace.pmacID,
          pmUID: '',
          pmID: '',
          collections: pmacWorkspace.collections.map(c => ({
            ...c,
            pmUID: '',
            pmID: '',
          })),
          environments: pmacWorkspace.environments.map(e => ({
            ...e,
            pmUID: '',
            pmID: '',
          })),
          monitors: [],
          mocks: [],
        }

        await fsWorkspaceManager.writeWorkspaceDataJson(unsyncedPmacWorkspace)

        // task.output = `pmac workspace '${pmacWorkspace.name}' un-synced successfully!`
      },
    }, {
      rendererOptions: { showTimer: true },
    })

    await unsyncTask.run()
  }
}
