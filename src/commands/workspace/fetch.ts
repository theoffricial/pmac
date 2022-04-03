import { Command, Flags } from '@oclif/core'

import { WorkspaceTypeValues } from '../../postman/api/types'
import { Listr } from 'listr2'
import { IFetchAllTaskCtx } from '../../commands-helpers/workspace/fetch.helper/types'
import { mainFetchTask } from '../../commands-helpers/workspace/fetch.helper/index'
import { PMACWorkspace } from '../../file-system/types'
import { SharedWorkspacesTasksCtx, workspaceSharedTasks } from '../../commands-helpers/shared/workspace-tasks'

export default class WorkspaceFetch extends Command {
  static description = 'Fetches one/all workspaces that are already have sync between pmac and Postman, and updating all new data from Postman to pmac.'

  static examples = [
    'pmac workspace fetch',
    'pmac workspace fetch -w .pmac/workspaces/team/<your-workspace>/pmac-workspace.json',
    'pmac workspace fetch --single | -s',
  ]

  static flags = {
    single: Flags.boolean({
      default: false,
      required: false,
      char: 's',
    }),
    'workspace-path': Flags.string({
      char: 'w',
      default: '',
      helpValue: 'relative/path/to/your/pmac-workspace.json',
      required: false,
    }),
    'type-filter': Flags.enum({
      required: false,
      char: 'f',
      options: WorkspaceTypeValues,
    }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(WorkspaceFetch)

    const fetchSingleWorkspaceTask = new Listr<{ pmacWorkspace: PMACWorkspace, customFetchTitle: string, pmacWorkspacePath: string }>(
      [
        {
          enabled: ctx => {
            if (flags.single) {
              ctx.customFetchTitle = 'Loading chosen pmac workspace'
              return true
            }

            return false
          },
          title: 'Fetching a single chosen workspace',
          task: async (ctx, task) => task.newListr<SharedWorkspacesTasksCtx.TPmacWorkspacesCombinedCtx>([
            workspaceSharedTasks.loadAllPmacWorkspacesTask(),
            workspaceSharedTasks.choosePmacWorkspaceTask(),
          ]),
        },
        {
          enabled: ctx => {
            if (flags['workspace-path'] && !flags.single) {
              ctx.customFetchTitle = 'Loading pmac workspace from path'
              return true
            }

            return false
          },
          title: 'Fetching a single workspace by path',
          task: async (ctx, task) => task.newListr([
            workspaceSharedTasks.loadWorkspaceByPathTask(flags['workspace-path']),
          ]),
        },
      ],
    )

    let singlePmacWorkspace: PMACWorkspace[]
    let customFetchTitle: string | undefined
    if (flags.single || flags['workspace-path']) {
      const ctx = await fetchSingleWorkspaceTask.run()
      singlePmacWorkspace = [ctx.pmacWorkspace]
      customFetchTitle = ctx.customFetchTitle
    }

    const fetchTask = new Listr({
      title: 'Fetching...',
      task: async (ctx, task) => task.newListr<IFetchAllTaskCtx>(
        mainFetchTask({ title: customFetchTitle }),
        {
          ctx: { customPmacWorkspaces: singlePmacWorkspace } as any,

          rendererOptions: { showTimer: true, collapse: false },
        }),
    })

    await fetchTask.run()
  }
}

