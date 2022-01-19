import { addNewItemsToCollection } from './add-new-items-to-collection'
import { PostmanCollectionItem } from '../../postman/api/types/collection.types'
describe('addNewItemsToCollection', () => {
  const newRequest: PostmanCollectionItem = {
    name: 'A new request',
    id: 'new 1',
    request: {} as any,
  }
  const existingRequestNo1: PostmanCollectionItem = {
    name: 'An existing request 1',
    id: 'exists 1',
    request: {} as any,
  }
  const existingRequestNo1WithDifferentId: PostmanCollectionItem = {
    name: 'An existing request 1',
    id: 'exists 1 - different id',
    request: {} as any,
  }
  const existingRequestNo2: PostmanCollectionItem = {
    name: 'An existing request 2',
    id: 'exists 2',
    request: {} as any,
  }

  const emptyFolder: PostmanCollectionItem = {
    name: 'empty-folder',
    item: [],
  }
  const folderWith2Request: PostmanCollectionItem = {
    name: 'folder-with-2-request',
    item: [existingRequestNo1, existingRequestNo2],
  }
  const folderWithNewRequest: PostmanCollectionItem = {
    name: 'folder-with-new-request',
    item: [newRequest],
  }

  it('should return all collection when collection not existed before', () => {
    const old: PostmanCollectionItem[] = []
    const newItems: PostmanCollectionItem[] = [newRequest]
    const result = addNewItemsToCollection(old, newItems)
    expect(result).toStrictEqual(newItems)
  })
  it('should add new request that has added', () => {
    const old: PostmanCollectionItem[] = [existingRequestNo1]
    const newItems: PostmanCollectionItem[] = [existingRequestNo1, newRequest]
    const result = addNewItemsToCollection(old, newItems)
    expect(result).toStrictEqual([newRequest, existingRequestNo1])
  })

  it('should delete request that has deleted', () => {
    const old: PostmanCollectionItem[] = [
      existingRequestNo1,
      existingRequestNo2,
    ]
    const newItems: PostmanCollectionItem[] = [existingRequestNo1]
    const result = addNewItemsToCollection(old, newItems)
    expect(result).toStrictEqual(newItems)
  })

  it('should not add different request with name that already exists', () => {
    const old: PostmanCollectionItem[] = [
      existingRequestNo1,
      existingRequestNo2,
    ]
    const newItems: PostmanCollectionItem[] = [
      existingRequestNo1WithDifferentId,
      existingRequestNo2,
    ]
    const result = addNewItemsToCollection(old, newItems)
    expect(result).toStrictEqual([existingRequestNo1, existingRequestNo2])
  })

  it('should add empty folder that has added', () => {
    const old: PostmanCollectionItem[] = [existingRequestNo1]
    const newItems: PostmanCollectionItem[] = [existingRequestNo1, emptyFolder]
    const result = addNewItemsToCollection(old, newItems)
    expect(result).toStrictEqual([existingRequestNo1, emptyFolder])
  })
  it('should add folder with requests that has added', () => {
    const old: PostmanCollectionItem[] = [existingRequestNo1]
    const newItems: PostmanCollectionItem[] = [
      existingRequestNo1,
      folderWithNewRequest,
      newRequest,
    ]
    const result = addNewItemsToCollection(old, newItems)
    expect(result).toStrictEqual([
      newRequest,
      existingRequestNo1,
      folderWithNewRequest,
    ])
  })

  it('should add request in an existing folder', () => {
    const old: PostmanCollectionItem[] = [existingRequestNo1, emptyFolder]
    const addRequestToEmptyFolder = { ...emptyFolder }
    addRequestToEmptyFolder.item = [newRequest]
    const newItems: PostmanCollectionItem[] = [
      existingRequestNo1,
      addRequestToEmptyFolder,
    ]
    const result = addNewItemsToCollection(old, newItems)
    expect(result).toStrictEqual([existingRequestNo1, addRequestToEmptyFolder])
  })
  it('should delete request in a specific folder that was exist', () => {
    const old: PostmanCollectionItem[] = [
      existingRequestNo2,
      folderWith2Request,
    ]
    const removeRequestFromFolder = { ...folderWith2Request }
    removeRequestFromFolder.item = [existingRequestNo2]
    const newItems: PostmanCollectionItem[] = [
      existingRequestNo2,
      existingRequestNo1,
      removeRequestFromFolder,
    ]
    const result = addNewItemsToCollection(old, newItems)
    expect(result).toStrictEqual([
      existingRequestNo1,
      existingRequestNo2,
      removeRequestFromFolder,
    ])
  })
  it('should delete empty folder that has deleted', () => {
    const old: PostmanCollectionItem[] = [existingRequestNo1, emptyFolder]
    const newItems: PostmanCollectionItem[] = [existingRequestNo1]
    const result = addNewItemsToCollection(old, newItems)
    expect(result).toStrictEqual([existingRequestNo1])
  })
  it('should delete folder with requests that has deleted', () => {
    const old: PostmanCollectionItem[] = [
      existingRequestNo1,
      folderWith2Request,
    ]
    const newItems: PostmanCollectionItem[] = [existingRequestNo1]
    const result = addNewItemsToCollection(old, newItems)
    expect(result).toStrictEqual([existingRequestNo1])
  })

  // Diagram about what scenario the last 2 tests are testing
  // [request, folder] => [request, folder] => [request, request] to
  // [request, folder] => [request, folder] => [request]
  // and vise-versa
  const lvl2RequestNo1: PostmanCollectionItem = {
    name: 'level 2 request ONE',
    request: {} as any,
  }
  const lvl2RequestNo2: PostmanCollectionItem = {
    name: 'level 2 request TWO',
    request: {} as any,
  }

  const lvl1Request: PostmanCollectionItem = {
    name: 'level 1 request',
    request: {} as any,
  }

  const lvl1FolderContains1Request: PostmanCollectionItem = {
    name: 'level-1-folder-contains-request-and-folder-with-1-requests',
    item: [lvl2RequestNo1],
  }
  const lvl1FolderContains2Request: PostmanCollectionItem = {
    name: 'level-1-folder-contains-request-and-folder-with-1-requests',
    item: [lvl2RequestNo1, lvl2RequestNo2],
  }

  const lvl0Request: PostmanCollectionItem = {
    name: 'level 0 request',
    request: {} as any,
  }
  const lvl0FolderContainsRequestAndFolderWith2Requests: PostmanCollectionItem =
    {
      name: 'level-1-folder-contains-request-and-folder-with-2-requests',
      item: [lvl1Request, lvl1FolderContains2Request],
    }
  const lvl0FolderContainsRequestAndFolderWith1Request: PostmanCollectionItem =
    {
      name: 'level-0-folder-contains-request-and-folder-with-1-request',
      item: [lvl1Request, lvl1FolderContains1Request],
    }

  it('should add request in multi-level folder', () => {
    const old: PostmanCollectionItem[] = [
      lvl0Request,
      lvl0FolderContainsRequestAndFolderWith1Request,
    ]
    const newItems: PostmanCollectionItem[] = [
      lvl0Request,
      lvl0FolderContainsRequestAndFolderWith2Requests,
    ]
    const result = addNewItemsToCollection(old, newItems)

    expect(result).toStrictEqual([
      lvl0Request,
      lvl0FolderContainsRequestAndFolderWith2Requests,
    ])

    const folderLevelOne = (result as PostmanCollectionItem[])[1]
    expect(folderLevelOne.item).toStrictEqual([
      lvl1Request,
      lvl1FolderContains2Request,
    ])

    const folderLevelTwo = (folderLevelOne.item as PostmanCollectionItem[])[1]

    expect(folderLevelTwo.item).toStrictEqual([lvl2RequestNo1, lvl2RequestNo2])
  })

  it('should delete request in multi-level folder', () => {
    const old: PostmanCollectionItem[] = [
      lvl0Request,
      lvl0FolderContainsRequestAndFolderWith2Requests,
    ]
    const newItems: PostmanCollectionItem[] = [
      lvl0Request,
      lvl0FolderContainsRequestAndFolderWith1Request,
    ]
    const result = addNewItemsToCollection(old, newItems)

    expect(result).toStrictEqual([
      lvl0Request,
      lvl0FolderContainsRequestAndFolderWith1Request,
    ])

    const folderLevelOne = (result as PostmanCollectionItem[])[1]
    expect(folderLevelOne.item).toStrictEqual([
      lvl1Request,
      lvl1FolderContains1Request,
    ])

    const folderLevelTwo = (folderLevelOne.item as PostmanCollectionItem[])[1]

    expect(folderLevelTwo.item).toStrictEqual([lvl2RequestNo1])
  })
})
