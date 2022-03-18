import { PMACWorkspace } from '../../../file-system/types'
import { WorkspaceType } from '../../../postman/api/types'

export namespace SharedWorkspacesTasksCtx {

    export interface ICtxPmacWorkspaces {
        pmacWorkspaces?: PMACWorkspace[],
        workspaceTypeFilter?: WorkspaceType
    }

    export interface ICtxSelectedWorkspace {
        pmacWorkspace?: PMACWorkspace
    }

    export interface ICtxPmacWorkspacePath {
        pmacWorkspacePath?: string
    }

    export type TCtxWorkspacesCombined = ICtxPmacWorkspaces & ICtxSelectedWorkspace
}
