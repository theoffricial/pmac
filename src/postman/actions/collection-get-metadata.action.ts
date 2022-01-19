import { PostmanCollection } from '../api/types/collection.types'
import { PostmanWorkspace } from '../api/types/workspace.types'
import { PostmanCollectionMetadata } from '../api/wrappers/collections.api'
import { IPmacAction } from './action.interface'

export class CollectionGetMetadataAction
implements IPmacAction<PostmanCollectionMetadata> {
  constructor(
    private readonly workspace: PostmanWorkspace,
    private readonly collection: PostmanCollection,
  ) {}

  async run() {
    const collectionMetadata = this.workspace.collections.find(
      c => c.id === this.collection.info._postman_id,
    ) as PostmanCollectionMetadata

    return { collectionMetadata }
  }
}
