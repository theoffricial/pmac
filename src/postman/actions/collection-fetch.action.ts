import { IPmacAction } from './action.interface'
import { PostmanAPI } from '../api'
import { PostmanCollection } from '../api/types/collection.types'

export class CollectionFetchAction implements IPmacAction<PostmanCollection> {
  constructor(
    private readonly postmanApi: PostmanAPI,
    private readonly collectionUid: string,
  ) {}

  async run(): Promise<{ collection: PostmanCollection }> {
    const {
      data: { collection },
    } = await this.postmanApi.collections.getCollection(this.collectionUid)

    return { collection }
  }
}
