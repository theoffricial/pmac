
import { PostmanCollection, PostmanEnvironment, PostmanMock, PostmanMonitor, PostmanWorkspace, WorkspaceResource, WorkspaceType } from '../../postman/api/types/index'
import { PMAC_MAP } from './pmac-map'

export interface PMACWorkspaceID extends PMAC_MAP {
    type: WorkspaceType
    name: string
}

export interface PMACWorkspace extends PMAC_MAP, PMACWorkspaceResourcesMappedProps {
    description: string;
    name: string;
    type: WorkspaceType;
}
export const PMACWorkspaceResourcesTypeMapValue: PMACWorkspaceResourcesTypeMap = {
  environments: WorkspaceResource.Environment,
  collections: WorkspaceResource.Collection,
  mocks: WorkspaceResource.Mock,
  monitors: WorkspaceResource.Monitor,
}

export type PMACWorkspaceResourcesTypeMap = {
    collections: WorkspaceResource.Collection,
    environments: WorkspaceResource.Environment,
    mocks: WorkspaceResource.Mock,
    monitors : WorkspaceResource.Monitor,
}

export type PMACWorkspaceResourcesDataType = {
    collections: PostmanCollection,
    environments: PostmanEnvironment,
    mocks: PostmanMock,
    monitors : PostmanMonitor,
}

export type PMACWorkspaceResourcesMappedProps = {
    [key in keyof PMACWorkspaceResourcesTypeMap]: PMAC_MAP[]
}

