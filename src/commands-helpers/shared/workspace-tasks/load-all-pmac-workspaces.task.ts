import { ListrTask } from 'listr2'
import { IPmacTaskOptions } from '.'
import { fsWorkspaceManager } from '../../../file-system'
import { WorkspaceType } from '../../../postman/api/types'
import { SharedWorkspacesTasksCtx } from './workspace-tasks-context.interface'

export interface ILoadAllPmacWorkspacesTaskOptions extends IPmacTaskOptions {
    typeFilter?: WorkspaceType
  }

export function loadAllPmacWorkspacesTask<T extends SharedWorkspacesTasksCtx.IPmacWorkspacesCtx>(options?: ILoadAllPmacWorkspacesTaskOptions): ListrTask<T> {
  return {
    skip: options?.skip,
    title: options?.title || 'Loading all pmac workspaces (repo/local)',
    task: async ctx => {
      const filterType = ctx.workspaceTypeFilter || options?.typeFilter
      ctx.pmacWorkspaces = await fsWorkspaceManager.getAllPMACWorkspaces(filterType)
    },
  }
}
