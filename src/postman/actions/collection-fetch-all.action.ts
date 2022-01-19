import { IPmacAction } from './action.interface'
import { PostmanAPI } from '../api'
import {
  PostmanWorkspace,
} from '../api/types/workspace.types'
import { PostmanCollectionMetadata } from '../api/wrappers/collections.api'

export class CollectionFetchAllAction
implements IPmacAction<PostmanCollectionMetadata[]> {
  constructor(
    private readonly postmanApi: PostmanAPI,
    private readonly workspace: PostmanWorkspace,
  ) {}

  async run(): Promise<{ collectionsMetadata: PostmanCollectionMetadata[]; }> {
    const {
      data: { collections },
    } = await this.postmanApi.collections.getAllCollectionsMetadata()

    const workspaceCollections = new Set(this.workspace.collections.map(c => c.uid))

    const workspaceCols = collections.filter(c =>
      workspaceCollections.has(c.uid),
    )
    return { collectionsMetadata: workspaceCols }
  }
}
