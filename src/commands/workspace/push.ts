import { Command } from '@oclif/core'

import { postmanApiInstance } from '../../postman/api'
import { fsWorkspaceManager } from '../../file-system'
import { Listr } from 'listr2'
import { workspaceSharedTasks } from '../../commands-helpers/shared/workspace-tasks'
import { choosePmacWorkspaceTaskV2 } from '../../commands-helpers/shared/workspace-tasks/choose-workspace.task'
import { PMACWorkspace } from '../../file-system/types'
import { PartialBy } from '../../commands-helpers/workspace/fetch.helper/types'

export default class WorkspacePush extends Command {
  static description = 'Fetches all pulled workspaces up-to-date.'

  static examples = [
    'pmac workspace push',
  ]

  async run(): Promise<void> {
    await this.parse(WorkspacePush)

    const loadAllPmacWorkspacesTask = new Listr(workspaceSharedTasks.loadAllPmacWorkspacesTask())
    const { pmacWorkspaces } = await loadAllPmacWorkspacesTask.run()

    const selectPmacWorkspaceTask = new Listr(choosePmacWorkspaceTaskV2(pmacWorkspaces))
    const { pmacWorkspace } = await selectPmacWorkspaceTask.run()

    await new Listr({
      title: `Pushing pmac workspace '${pmacWorkspace.name}' into Postman`,
      task: async () => {
        await (pmacWorkspace.pmID ? updatePostmanWorkspace({
          ...pmacWorkspace,
          pmID: pmacWorkspace.pmID,
        }) : createNewPostmanWorkspace(pmacWorkspace))
      },
    }).run()
  }
}

async function createNewPostmanWorkspace(pmacWorkspace: PMACWorkspace) {
  const { data: { workspace } } = await postmanApiInstance.workspaces.createWorkspace({
    name: pmacWorkspace.name,
    type: pmacWorkspace.type,
    collections: [],
    description: pmacWorkspace.description,
    environments: [],
    mocks: [],
    monitors: [],
  })

  await fsWorkspaceManager.writeWorkspaceDataJson({ ...pmacWorkspace, pmID: workspace.id })

  return workspace
}

type UpdateWorkspace = PartialBy<Required<PMACWorkspace>, 'pmUID' | 'pmIDTmp'>
async function updatePostmanWorkspace(pmacWorkspace: UpdateWorkspace) {
  const { data: { workspace } } = await postmanApiInstance.workspaces.updateWorkspace(pmacWorkspace.pmID, {
    name: pmacWorkspace.name,
    type: pmacWorkspace.type,
    description: pmacWorkspace.description,
  })

  return workspace
}
