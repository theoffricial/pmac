
import { WorkspaceType } from '../../postman/api/types/index'
import { PMAC_MAP } from './pmac-map'

export interface PMACWorkspaceID extends PMAC_MAP {
    type: WorkspaceType
    name: string
}

export interface PMACWorkspace extends PMAC_MAP {
    description: string;
    name: string;
    type: WorkspaceType;
    collections: PMAC_MAP[];
    environments: PMAC_MAP[];
    mocks: PMAC_MAP[];
    monitors: PMAC_MAP[];
}

