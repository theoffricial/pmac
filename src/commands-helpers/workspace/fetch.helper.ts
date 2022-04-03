import { SharedWorkspacesTasksCtx } from '../shared/workspace-tasks'

export type PmacWorkspaceFetchCtx =
    SharedWorkspacesTasksCtx.TPmacWorkspacesCombinedCtx &
    SharedWorkspacesTasksCtx.ISelectedPostmanWorkspaceCtx

export type PmacWorkspaceFetchLoadCtx =
    SharedWorkspacesTasksCtx.TPmacWorkspacesCombinedCtx &
    SharedWorkspacesTasksCtx.ISelectedPostmanWorkspaceCtx
