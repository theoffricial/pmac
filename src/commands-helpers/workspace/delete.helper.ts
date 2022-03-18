import { ListrTask } from 'listr2'
import { fsWorkspaceManager } from '../../file-system'
import { postmanApiInstance } from '../../postman/api'
import { SharedWorkspacesTasksCtx } from '../shared/workspace-tasks/workspace-tasks-context.interface'

type TCtxWorkspaceData =
    SharedWorkspacesTasksCtx.TCtxWorkspacesCombined &
    SharedWorkspacesTasksCtx.ICtxPmacWorkspacePath

export interface PmacWorkspaceDeleteCtx extends TCtxWorkspaceData {
    deletedPmacID?: string
    deletePmId?: string
    pmacWorkspacePath?: string
    pmacOnly?: boolean
    pmOnly?: boolean
}

const deletePmacWorkspaceTask: ListrTask<PmacWorkspaceDeleteCtx> = {
  skip: ctx => ctx.pmOnly === true,
  title: 'Deleting pmac (repo) workspace.',
  task: async ctx => {
    if (!ctx.pmacWorkspace) {
      throw new Error('Failed to delete pmac workspace, selected pmac workspace to delete not found')
    }

    await fsWorkspaceManager.deletePMACWorkspaceByWid(ctx.pmacWorkspace)
    ctx.deletedPmacID = ctx.pmacWorkspace.pmacID
  },
}

const deletePmAccountWorkspaceTask: ListrTask<PmacWorkspaceDeleteCtx> = {
  skip: ctx => ctx.pmacOnly === true,
  title: 'Deleting workspace from Postman account.',
  task: async (ctx, task) => {
    if (!ctx.pmacWorkspace) {
      throw new Error('Failed to delete pmac workspace, selected pmac workspace to delete not found')
    }

    if (!ctx.pmacWorkspace.pmID) {
      throw new Error('No Postman workspace id found for this workspace, Probably this workspace never pushed to your Postman account, consider to use "--pmac-only" flag')
    }

    const { pmID } = ctx.pmacWorkspace
    const { data: { workspace: { id } } } = await postmanApiInstance.workspaces.deleteWorkspace(pmID)

    ctx.deletePmId = id
  },
}

export const workspaceDeleteHelper = {
  deletePmacWorkspaceTask,
  deletePmAccountWorkspaceTask,
}
