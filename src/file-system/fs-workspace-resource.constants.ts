import { PostmanCollection, PostmanEnvironment, PostmanMock, PostmanMonitor, WorkspaceResource } from '../postman/api/types'

type ResourceTypeMapper = {
    [WorkspaceResource.Collection]: PostmanCollection;
    [WorkspaceResource.Environment]: PostmanEnvironment;
    [WorkspaceResource.Mock]: PostmanMock;
    [WorkspaceResource.Monitor]: PostmanMonitor;
}

export type ResourceTypeMap<T extends WorkspaceResource> = ResourceTypeMapper[T]
export const PM_RESOURCE_PREFIX = 'postman_'
const COLLECTION_SUFFIX = `${PM_RESOURCE_PREFIX}${WorkspaceResource.Collection}`
const COLLECTION_SUFFIX_WITH_EXT = `${COLLECTION_SUFFIX}.json`
const ENVIRONMENT_SUFFIX = `${PM_RESOURCE_PREFIX}${WorkspaceResource.Environment}`
const ENVIRONMENT_SUFFIX_WITH_EXT = `${ENVIRONMENT_SUFFIX}.json`
const MOCK_SUFFIX = `${PM_RESOURCE_PREFIX}${WorkspaceResource.Mock}`
const MOCK_SUFFIX_WITH_EXT = `${MOCK_SUFFIX}.json`
const MONITOR_SUFFIX = `${PM_RESOURCE_PREFIX}${WorkspaceResource.Monitor}`
const MONITOR_SUFFIX_WITH_EXT = `${MONITOR_SUFFIX}.json`

export const WORKSPACE_RESOURCES_DEFINITIONS = {
  [WorkspaceResource.Collection]: {
    fileSuffix: COLLECTION_SUFFIX,
    fileSuffixAndExt: COLLECTION_SUFFIX_WITH_EXT,
  },
  [WorkspaceResource.Environment]: {
    fileSuffix: ENVIRONMENT_SUFFIX,
    fileSuffixAndExt: ENVIRONMENT_SUFFIX_WITH_EXT,
  },
  [WorkspaceResource.Mock]: {
    fileSuffix: MOCK_SUFFIX,
    fileSuffixAndExt: MOCK_SUFFIX_WITH_EXT,
  },
  [WorkspaceResource.Monitor]: {
    fileSuffix: MONITOR_SUFFIX,
    fileSuffixAndExt: MONITOR_SUFFIX_WITH_EXT,
  },
}
