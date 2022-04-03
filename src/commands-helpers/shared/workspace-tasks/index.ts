import { ListrTask } from 'listr2'
import { choosePmacWorkspaceTask } from './choose-workspace.task'
import { loadAllPmacWorkspacesTask } from './load-all-pmac-workspaces.task'
import { loadWorkspaceByPathTask } from './load-pmac-workspace-by-path.task'

export type IPmacTaskOptions = Partial<ListrTask<any>>

export const workspaceSharedTasks = {
  loadAllPmacWorkspacesTask,
  choosePmacWorkspaceTask,
  loadWorkspaceByPathTask,
}

export * from './workspace-tasks-context.interface'
