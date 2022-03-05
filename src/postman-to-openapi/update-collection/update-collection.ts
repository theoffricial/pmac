import { PostmanCollectionItem } from '../../postman/api/types/collection.types'

export function getNewCollectionItemsFromOpenAPI(
  currentItemsFromPostman: PostmanCollectionItem[],
  newItemsFromOpenAPISpecification: PostmanCollectionItem[],
  // eslint-disable-next-line unicorn/no-object-as-default-parameter
  options = { delete: false },
): PostmanCollectionItem[] {
  // Setup
  const currentItemsDuplication = [...currentItemsFromPostman]
  const oaItemsDuplication = [...newItemsFromOpenAPISpecification]
  const oaRequestsMap = new Map<string, PostmanCollectionItem>()
  const oaFoldersMap = new Map<string, PostmanCollectionItem>()
  const oaRequests: PostmanCollectionItem[] = []
  const oaFolders: PostmanCollectionItem[] = []

  // divide new items to folders and requests
  for (const newItem of oaItemsDuplication) {
    if (Array.isArray(newItem.item)) {
      oaFoldersMap.set(newItem.name, newItem)
      oaFolders.push(newItem)
    } else {
      oaRequestsMap.set(newItem.name, newItem)
      oaRequests.push(newItem)
    }
  }

  const currentRequestsMap = new Map<string, PostmanCollectionItem>()
  const currentFoldersMap = new Map<string, PostmanCollectionItem>()
  const currentRequests: PostmanCollectionItem[] = []
  const currentFolders: PostmanCollectionItem[] = []

  // divides current items to folders and requests
  for (const currentItem of currentItemsDuplication) {
    if (Array.isArray(currentItem.item)) {
      currentFoldersMap.set(currentItem.name, currentItem)
      currentFolders.push(currentItem)
    } else {
      currentRequestsMap.set(currentItem.name, currentItem)
      currentRequests.push(currentItem)
    }
  }

  // duplicate old items as initial value
  const newRequests: PostmanCollectionItem[] = []
  const newFolders: PostmanCollectionItem[] = []

  // Add new requests
  for (const newRequest of oaRequests) {
    const currentRequest = currentRequestsMap.get(newRequest.name)

    if (Array.isArray(newRequest?.request?.url?.path)) {
      setItemRequestPath(newRequest)
    }

    // new requests
    if (currentRequest) {
      // existing request
      newRequests.push({ ...newRequest, event: currentRequest.event || [] })
    } else {
      newRequests.push(newRequest)
    }
  }

  // Add new folders
  for (const newFolder of oaFolders) {
    const currentFolder = currentFoldersMap.get(newFolder.name)
    if (currentFolder) {
      // scenario when folder already existed
      const updatedItems = getNewCollectionItemsFromOpenAPI(
        currentFolder.item as PostmanCollectionItem[],
        newFolder.item as PostmanCollectionItem[],
      )
      newRequests.push({
        ...newFolder,
        // update items
        item: updatedItems,
        // update the new folder events
        event: currentFolder.event || [],
      })
    } else {
      // when folder is new
      newFolders.push(newFolder)
    }
  }

  // if (options.delete) {
  // Delete old items only if explicitly requested
  // Delete requests there were deleted
  // const deletedRequestsNames: string[] = [];
  // const deletedFoldersNames: string[] = [];
  const requestsToReturn = [...newRequests]
  for (const currentRequest of currentRequests) {
    const request = oaRequestsMap.get(currentRequest.name)
    if (!options.delete && !request) {
      requestsToReturn.push(currentRequest)
    }
  }

  const foldersToReturn = [...newFolders]

  for (const currentFolder of currentFolders) {
    const folder = oaFoldersMap.get(currentFolder.name)
    if (!options.delete && !folder) {
      foldersToReturn.push(currentFolder)
    }
  }

  return [...foldersToReturn, ...requestsToReturn].sort((a, b) => {
    if (a.name < b.name) return -1
    if (a.name > b.name) return 1
    return 0
  })
}

// Set new path parameters for request item - item.request.url.path
function setItemRequestPath(item: PostmanCollectionItem) {
  if (item && item.request && item.request.url && Array.isArray(item.request.url.path)) {
    item.request.url.path = convertPathParametersToPMEnvVars(item.request.url.path)
  }
}

const oa3PathParamPrefix = ':'
const pmEnvVarPrefix = '{{'
const pmEnvVarSuffix = '}}'

// Converts path params from OA3 e.g. :petId to PM variables e.g. {{petId}}
function convertPathParametersToPMEnvVars(path: string[]) {
  const converted = path.map((fragment: string) => {
    return fragment.startsWith(oa3PathParamPrefix) ? replaceOA3PathParameterToPMVariableFormat(fragment) : fragment
  })
  return converted
}

function replaceOA3PathParameterToPMVariableFormat(pathParameter: string) {
  const prefixReplaced = pathParameter.replace(oa3PathParamPrefix, pmEnvVarPrefix)
  return prefixReplaced + pmEnvVarSuffix
}
