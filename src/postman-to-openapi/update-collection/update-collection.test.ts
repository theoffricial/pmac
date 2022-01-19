import { getNewCollectionItemsFromOpenAPI } from './update-collection'
import { PostmanCollectionItem } from '../../postman/api/types/collection.types'

describe('getNewCollectionItemsFromOpenAPI', () => {
  const updatedCurrentRequest: PostmanCollectionItem = {
    name: 'request-no-1',
    id: '1',
    request: {
      url: {
        host: ['https://google.com'],
        path: ['new-url', ':someParam'],
        query: [],
        variable: [],
      },
      method: 'GET',
      header: [],
    },
  }

  const pmEvent = [
    {
      listen: 'test',
      script: {
        id: '423d4419-de8a-4dfe-ac93-dbd139a55df6',
        exec: [
          "pm.test('should return 200', function () {",
          '    pm.response.to.have.status(200);',
          '    const jsonData = pm.response.json();',
          "    pm.expect(jsonData).to.haveOwnProperty('name');",
          '});',
        ],
        type: 'text/javascript',
      },
    },
  ]
  const currentOaRequest: PostmanCollectionItem = {
    name: 'request-no-1',
    id: '1',
    request: {
      url: {
        host: ['https://google.com'],
        path: ['old-url'],
        query: [],
        variable: [],
      },
      method: 'PATCH',
      header: [],
    },
    event: pmEvent,
  }

  const newRequestFromOa: PostmanCollectionItem = {
    name: 'new-request-no-2',
    id: '2',
    request: {
      url: {
        host: ['https://youtube.com'],
        path: ['new-request'],
        query: [],
        variable: [],
      },
      method: 'GET',
      header: [],
    },
  }

  const emptyFolder: PostmanCollectionItem = {
    name: 'empty-folder',
    item: [],
    event: pmEvent,
  }

  it('should update request when existed when event defined', () => {
    const current: PostmanCollectionItem[] = [currentOaRequest]
    const newOaItems: PostmanCollectionItem[] = [updatedCurrentRequest]
    const result = getNewCollectionItemsFromOpenAPI(current, newOaItems)
    expect(result).toStrictEqual([
      { ...updatedCurrentRequest, event: pmEvent },
    ])
  })
  it('should update request when existed when event not defined', () => {
    const current: PostmanCollectionItem[] = [
      { ...currentOaRequest, event: [] },
    ]
    const newOaItems: PostmanCollectionItem[] = [updatedCurrentRequest]
    const result = getNewCollectionItemsFromOpenAPI(current, newOaItems)
    expect(result).toStrictEqual([{ ...updatedCurrentRequest, event: [] }])
  })

  it('should add new request', () => {
    const current: PostmanCollectionItem[] = [currentOaRequest]
    const newOaItems: PostmanCollectionItem[] = [
      updatedCurrentRequest,
      newRequestFromOa,
    ]
    const result = getNewCollectionItemsFromOpenAPI(current, newOaItems)
    expect(result).toStrictEqual([
      newRequestFromOa,
      { ...updatedCurrentRequest, event: pmEvent },
    ])
  })

  it('should add empty folder with event', () => {
    const current: PostmanCollectionItem[] = []
    const newOaItems: PostmanCollectionItem[] = [emptyFolder]
    const result = getNewCollectionItemsFromOpenAPI(current, newOaItems)
    expect(result).toStrictEqual([emptyFolder])
  })
  it('should add empty folder without event', () => {
    const current: PostmanCollectionItem[] = []
    const newOaItems: PostmanCollectionItem[] = [{ ...emptyFolder, event: [] }]
    const result = getNewCollectionItemsFromOpenAPI(current, newOaItems)
    expect(result).toStrictEqual([{ ...emptyFolder, event: [] }])
  })

  it("should update request's event in folder", () => {
    const currentFolder: PostmanCollectionItem = {
      name: 'some-folder',
      item: [{ ...currentOaRequest, event: pmEvent }],
    }
    const newFolder: PostmanCollectionItem = {
      name: 'some-folder',
      item: [updatedCurrentRequest],
    }

    const current: PostmanCollectionItem[] = [currentFolder]
    const newOaItems: PostmanCollectionItem[] = [newFolder]
    const result = getNewCollectionItemsFromOpenAPI(current, newOaItems)
    expect(result).toStrictEqual([
      {
        ...newFolder,
        event: [],
        item: [{ ...updatedCurrentRequest, event: pmEvent }],
      },
    ])
  })
  it.only('should add request into folder', () => {
    const currentFolder: PostmanCollectionItem = {
      name: 'some-folder',
      item: [{ ...currentOaRequest, event: pmEvent }],
    }
    const newFolder: PostmanCollectionItem = {
      name: 'some-folder',
      item: [newRequestFromOa],
    }

    const current: PostmanCollectionItem[] = [currentFolder]
    const newOaItems: PostmanCollectionItem[] = [newFolder]
    const result = getNewCollectionItemsFromOpenAPI(current, newOaItems)
    expect(result).toStrictEqual([
      {
        ...newFolder,
        event: [],
        item: [newRequestFromOa, { ...currentOaRequest, event: pmEvent }],
      },
    ])
  })
})
