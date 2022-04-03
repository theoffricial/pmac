import { PMACWorkspaceResourcesDataType, PMACWorkspaceResourcesTypeMap, PMACWorkspaceResourcesTypeMapValue } from '../../../file-system/types'
import { PMAC_MAP } from '../../../file-system/types/pmac-map'
import { postmanApiInstance } from '../../../postman/api'
import { WorkspaceResource } from '../../../postman/api/types'
import { BuildFetchedWorkspaceResourceType, OneOfPostmanResourceType, RequiredWorkspaceDataForFetch } from './types'

interface FetchingResourcesPromised {
    identifiers: Required<Omit<PMAC_MAP, 'pmIDTmp'>>,
    promise: Promise<OneOfPostmanResourceType>
}

const objectApiCallMap: { [key in keyof PMACWorkspaceResourcesDataType]: (pmacUID: string) => Promise<PMACWorkspaceResourcesDataType[key]> } = {
  collections: async (pmacUID: string) => {
    const res = await postmanApiInstance.collections.getCollection(pmacUID)
    const { collection: pmResourceData }  = res.data
    return pmResourceData
  },
  environments: async (pmacUID: string) => {
    const res = await postmanApiInstance.environments.getEnvironment(pmacUID)
    const { environment: pmResourceData }  = res.data
    return pmResourceData
  },
  mocks: async (pmacUID: string) => {
    const res = await postmanApiInstance.mocks.singleMock(pmacUID)
    const { mock: pmResourceData }  = res.data
    return pmResourceData
  },
  monitors: async (pmacUID: string) => {
    const res = await postmanApiInstance.monitors.getMonitor(pmacUID)
    const { monitor: pmResourceData }  = res.data
    return pmResourceData
  },
}

export async function fetchWorkspaceResourcesByType<T extends keyof PMACWorkspaceResourcesTypeMap>(pmacWorkspace: RequiredWorkspaceDataForFetch, type: T) {
  const workspaceResourceType = PMACWorkspaceResourcesTypeMapValue[type]
  const pmacResources = pmacWorkspace[type]
  // const postmanResourcesPromises = []
  const resourcesData: FetchingResourcesPromised[] = []
  // const pmacWorkspaceResourceUIDs: Required<Omit<PMAC_MAP, 'pmIDTmp'>>[] = []
  for (const pmacResource of pmacResources) {
    if (!pmacResource.pmUID || !pmacResource.pmID) {
      continue
    }

    const { pmUID: resourcePmUID, pmacID, pmID } = pmacResource
    resourcesData.push({
      identifiers: { pmUID: resourcePmUID, pmacID, pmID },
      promise: objectApiCallMap[type](resourcePmUID),
    })
  }

  const pmResourcesResponses = await Promise.allSettled(resourcesData.map(r => r.promise))

  const settledResults: BuildFetchedWorkspaceResourceType[] = resourcesData.map((r, i) => ({
    identifiers: r.identifiers,
    settledResult: pmResourcesResponses[i],
    workspaceResourceType,
  }))

  return settledResults
}
