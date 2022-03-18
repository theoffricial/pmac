import { ListrTask } from 'listr2'
import { fsWorkspaceManager } from '../../../file-system'
import { SharedWorkspacesTasksCtx } from './workspace-tasks-context.interface'
import { choosePmacWorkspaceTask } from './choose-workspace.task'
import { loadWorkspaceByPathTask } from './load-workspace-by-path.task'

export interface ICtxOptions {
  customTitle?: string
  skip?: boolean
}

function getAllPmacWorkspacesTask(options?: ICtxOptions): ListrTask<SharedWorkspacesTasksCtx.ICtxPmacWorkspaces> {
  return {
    skip: options?.skip,
    title: options?.customTitle || 'Loading all pmac workspaces (repo/local)',
    task: async ctx => {
      ctx.pmacWorkspaces = await fsWorkspaceManager.getAllPMACWorkspaces(ctx.workspaceTypeFilter)
    },
  }
}

export const workspaceSharedTasks = {
  getAllPmacWorkspacesTask,
  choosePmacWorkspaceTask,
  loadWorkspaceByPathTask,
}

export * from './workspace-tasks-context.interface'
