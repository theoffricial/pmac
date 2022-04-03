import { Command, Flags } from '@oclif/core'
import { Listr, ListrTask } from 'listr2'
import { PmacWorkspaceDeleteCtx, workspaceDeleteHelper } from '../../commands-helpers/workspace/delete.helper'
import { SharedWorkspacesTasksCtx, workspaceSharedTasks } from '../../commands-helpers/shared/workspace-tasks'
import { PMACWorkspace } from '../../file-system/types'

export default class WorkspaceDelete extends Command {
  static description = `Deletes a workspace, allowing deleting a workspace from your Postman account, from pmac (your repo), or both. 
  By default deletes both, for more information, use --help.`

  static examples = [
    'pmac workspace delete',
    'pmac workspace delete -w ./.pmac/workspaces/personal/test-env_pmacf7367da5e7e34110aaeb956db8b7d777/pmac-workspace.json',
    'pmac workspace delete -w ./.pmac/workspaces/personal/test-env_pmacf7367da5e7e34110aaeb956db8b7d777/pmac-workspace.json --pmac-only',
    'pmac workspace delete --pm-only',
  ]

  static flags = {
    'pm-only': Flags.boolean({
      char: 'r',
      description: 'Deletes a workspace only from your Postman account, But do not delete the workspace from pmac (your repo).',
      required: false,
      default: false,
    }),
    'pmac-only': Flags.boolean({
      char: 'l',
      description: 'Deletes only pmac workspace (your repo), But do not delete the workspace from your Postman account.',
      required: false,
      default: false,
    }),
    'workspace-path': Flags.string({
      char: 'w',
      default: '',
      helpValue: 'relative/path/to/your/pmac-workspace.json',
      required: false,
    }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(WorkspaceDelete)

    const isWorkspacePathDefined = Boolean(flags['workspace-path'])

    let selectedPmacWorkpsaceToDelete: PMACWorkspace
    if (isWorkspacePathDefined) {
      const { pmacWorkspace } = await new Listr<SharedWorkspacesTasksCtx.TPmacWorkspacesCombinedCtx>([
        workspaceSharedTasks.loadAllPmacWorkspacesTask({}),
        workspaceSharedTasks.choosePmacWorkspaceTask({
          title: 'Choose workspace to delete',
        }),
      ]).run()
      selectedPmacWorkpsaceToDelete = pmacWorkspace
    } else {
      const { pmacWorkspace } = await new Listr<SharedWorkspacesTasksCtx.ISelectedPmacWorkspacePathCtx & SharedWorkspacesTasksCtx.ISelectedPmacWorkspaceCtx>([
        workspaceSharedTasks.loadWorkspaceByPathTask(flags['workspace-path'], {
          title: 'Loading workspace by given path..',
        }),
      ]).run()
      selectedPmacWorkpsaceToDelete = pmacWorkspace
    }

    const subTasks: ListrTask<PmacWorkspaceDeleteCtx>[] = [
      workspaceSharedTasks.loadAllPmacWorkspacesTask({
        skip: isWorkspacePathDefined,
      }),
      workspaceSharedTasks.choosePmacWorkspaceTask({
        title: 'Choose workspace to delete',
        skip: isWorkspacePathDefined,
      }),
      workspaceSharedTasks.loadWorkspaceByPathTask('', {
        title: 'Loading workspace by given path..',
        skip: !isWorkspacePathDefined,
      }),
      workspaceDeleteHelper.deletePmAccountWorkspaceTask,
      workspaceDeleteHelper.deletePmacWorkspaceTask,
    ]

    const mainTask = new Listr<PmacWorkspaceDeleteCtx>({
      title: 'Deleting workspace..',
      task: async (_ctx, task) => task.newListr([
        workspaceDeleteHelper.deletePmAccountWorkspaceTask,
        workspaceDeleteHelper.deletePmacWorkspaceTask,
      ]),
    },
    {
      ctx: {
        pmOnly: flags['pm-only'],
        pmacOnly: flags['pmac-only'],
        pmacWorkspacePath: flags['workspace-path'],
        pmacWorkspace: selectedPmacWorkpsaceToDelete,
        pmacWorkspaces: [],
      },
      rendererOptions: { showErrorMessage: false, collapse: false, showTimer: true },
    })

    const ctx = await mainTask.run()
    if (ctx.deletePmId) {
      this.log(
        `Workspace ${ctx.pmacWorkspace?.name} (pmID: ${ctx.deletePmId}) deleted from your Postman account.`,
      )
    }

    if (ctx.deletedPmacID) {
      this.log(
        `Workspace ${ctx.pmacWorkspace?.name} (pmacID: ${ctx.deletedPmacID}) deleted from pmac (repo).`,
      )
    }
  }
}
