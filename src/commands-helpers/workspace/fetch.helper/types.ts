import { PMACWorkspace, PMACWorkspaceResourceIDWithWID } from '../../../file-system/types'
import { PMAC_MAP } from '../../../file-system/types/pmac-map'
import { PostmanCollection, PostmanEnvironment, PostmanMock, PostmanMonitor, PostmanWorkspaceMetadata, WorkspaceResource } from '../../../postman/api/types'

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredWorkspaceDataForFetch = PartialBy<Required<PMACWorkspace>, 'pmUID' | 'pmIDTmp'>
export type RequiredWridData = PartialBy<Required<PMACWorkspaceResourceIDWithWID>, 'pmIDTmp'>

export interface IFetchAllTaskCtx {
    pmacWorkspaces: RequiredWorkspaceDataForFetch[]
    pmWorkspaceDataForFetch: PostmanWorkspaceMetadata[]
}

export type OneOfPostmanResourceType = PostmanCollection | PostmanEnvironment | PostmanMock | PostmanMonitor

export interface BuildFetchedWorkspaceResourceType {
    identifiers: Required<Omit<PMAC_MAP, 'pmIDTmp'>>;
    settledResult: PromiseSettledResult<OneOfPostmanResourceType>;
    workspaceResourceType: WorkspaceResource
}

export interface IFetchAllTaskCtx {
    pmacWorkspaces: RequiredWorkspaceDataForFetch[]
    /** final loaded list of pmac workspaces for fetch */
    loadedPmacWorkspaces: PMACWorkspace[]
    /** custom pick of pmac workspace array */
    customPmacWorkspaces: PMACWorkspace[]
    pmWorkspaceDataForFetch: PostmanWorkspaceMetadata[]
}
