import { IPMACAction } from './action.interface'
import { PostmanAPI } from '../api'
import { PostmanCollection } from '../api/types/collection.types'

export class PMCollectionFetchAction implements IPMACAction<PostmanCollection> {
  constructor(
    private readonly postmanApi: PostmanAPI,
    private readonly pmCollectionUid: string,
  ) {}

  async run() {
    try {
      const {
        data: { collection },
      } = await this.postmanApi.collections.getCollection(this.pmCollectionUid)

      return collection
    } catch (error) {
      // add logger?
      console.error(error)
      throw new Error(`Error while fetching collection ${this.pmCollectionUid} from Postman.`)
    }
  }
}
