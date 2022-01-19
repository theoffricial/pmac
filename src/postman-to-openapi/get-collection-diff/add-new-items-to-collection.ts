import { PostmanCollectionItem } from '../../postman/api/types/collection.types'

export function addNewItemsToCollection(
  oldItems: PostmanCollectionItem[],
  newItems: PostmanCollectionItem[],
): PostmanCollectionItem[] {
  const duplicateOldItems = [...oldItems]
  const duplicateNewItems = [...newItems]
  // Setup
  const newRequestsMap = new Map<string, PostmanCollectionItem>()
  const newFoldersMap = new Map<string, PostmanCollectionItem>()
  const newRequests: PostmanCollectionItem[] = []
  const newFolders: PostmanCollectionItem[] = []
  for (const newItem of duplicateNewItems) {
    if (Array.isArray(newItem.item)) {
      newFoldersMap.set(newItem.name, newItem)
      newFolders.push(newItem)
    } else {
      newRequestsMap.set(newItem.name, newItem)
      newRequests.push(newItem)
    }
  }

  const oldRequestsMap = new Map<string, PostmanCollectionItem>()
  const oldFoldersMap = new Map<string, PostmanCollectionItem>()
  const oldRequests: PostmanCollectionItem[] = []
  const oldFolders: PostmanCollectionItem[] = []
  for (const oldItem of duplicateOldItems) {
    if (Array.isArray(oldItem.item)) {
      oldFoldersMap.set(oldItem.name, oldItem)
      oldFolders.push(oldItem)
    } else {
      oldRequestsMap.set(oldItem.name, oldItem)
      oldRequests.push(oldItem)
    }
  }

  // duplicate old items as initial value
  const newRequestsToAdd: PostmanCollectionItem[] = []
  const newFoldersToAdd: PostmanCollectionItem[] = []

  // Add new requests
  for (const newRequest of newRequests) {
    const request = oldRequestsMap.get(newRequest.name)
    if (!request) {
      newRequestsToAdd.push(newRequest)
    }
  }

  // Add new folders
  for (const newFolder of newFolders) {
    const folder = oldFoldersMap.get(newFolder.name)
    if (!folder) {
      newFoldersToAdd.push(newFolder)
    }
  }

  // Delete requests there were deleted
  const oldRequestsNamesToDelete: string[] = []
  const oldFoldersNamesToDelete: string[] = []
  for (const oldRequest of oldRequests) {
    const request = newRequestsMap.get(oldRequest.name)
    if (!request) {
      oldRequestsNamesToDelete.push(oldRequest.name)
    }
  }

  for (const oldFolder of oldFolders) {
    const folder = newFoldersMap.get(oldFolder.name)
    if (!folder) {
      oldFoldersNamesToDelete.push(oldFolder.name)
    }
  }

  // Remove deleted requests
  const oldRequestsToKeep = oldRequests.filter(
    oi => !oldRequestsNamesToDelete.includes(oi.name),
  )

  const oldFoldersToKeep = oldFolders.filter(
    folder => !oldFoldersNamesToDelete.includes(folder.name),
  )

  // Recursive for folders to keep
  for (const oldFolderToKeep of oldFoldersToKeep) {
    const newFolder = newFoldersMap.get(oldFolderToKeep.name)

    const updatedFolderItems = addNewItemsToCollection(
      oldFolderToKeep.item as PostmanCollectionItem[],
      newFolder?.item as PostmanCollectionItem[],
    );
    (oldFolderToKeep as PostmanCollectionItem).item = updatedFolderItems
  }

  return [
    ...oldFoldersToKeep,
    ...newFoldersToAdd,
    ...oldRequestsToKeep,
    ...newRequestsToAdd,
  ].sort((a, b) => {
    if (a.name < b.name) return -1
    if (a.name > b.name) return 1
    return 0
  })
}
