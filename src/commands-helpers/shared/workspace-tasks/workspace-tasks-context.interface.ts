import { PMACWorkspace } from '../../../file-system/types'
import { PostmanWorkspace, PostmanWorkspaceMetadata, WorkspaceType } from '../../../postman/api/types'

export namespace SharedWorkspacesTasksCtx {

    export interface IPmacWorkspacesCtx {
        pmacWorkspaces: PMACWorkspace[],
        workspaceTypeFilter?: WorkspaceType
    }

    export interface ISelectedPmacWorkspaceCtx {
        pmacWorkspace: PMACWorkspace
    }

    export interface ISelectedPmacWorkspacePathCtx {
        pmacWorkspacePath: string
    }

    export interface IPostmanWorkspacesCtx {
        postmanWorkspaces: PostmanWorkspace[]
    }

    export interface ISelectedPostmanWorkspaceCtx {
        postmanWorkspace: PostmanWorkspace
    }
    export interface IPostmanWorkspacesMetadataCtx {
        postmanWorkspacesMetadata: PostmanWorkspaceMetadata[]
    }

    export interface ISelectedPostmanWorkspaceMetadataCtx {
        postmanWorkspaceMetadata: PostmanWorkspaceMetadata
    }

    export type TPmacWorkspacesCombinedCtx = IPmacWorkspacesCtx & ISelectedPmacWorkspaceCtx
    export type TPostmanWorkspacesCombinedCtx = IPostmanWorkspacesCtx & ISelectedPostmanWorkspaceCtx
    export type TPostmanWorkspacesMetadataCombinedCtx = IPostmanWorkspacesMetadataCtx & ISelectedPostmanWorkspaceMetadataCtx
}
