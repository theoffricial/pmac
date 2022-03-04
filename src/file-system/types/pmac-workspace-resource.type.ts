import { WorkspaceResource, WorkspaceType } from '../../postman/api/types'
import { PMAC_MAP } from './pmac-map'

export interface PMACWorkspaceResourceIDWithWID extends PMACWorkspaceResourceID {
    workspaceName: string
    workspaceType: WorkspaceType
    workspacePMACId: string
    type: WorkspaceResource
    name: string
}

export interface PMACWorkspaceResourceID extends PMAC_MAP {
    type: WorkspaceResource
    name: string
}
