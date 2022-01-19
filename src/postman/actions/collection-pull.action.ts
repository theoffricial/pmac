import { IPmacAction } from './action.interface'
import { PostmanAPI } from '../api'
import PmacConfigurationManager from '../../file-system/pmac-configuration-manager'
import { PostmanWorkspace } from '../api/types/workspace.types'
import { PostmanCollection } from '../api/types/collection.types'

export class CollectionPullAction implements IPmacAction<PostmanCollection> {
  constructor(
    private readonly config: PmacConfigurationManager,
    private readonly postmanApi: PostmanAPI,
    private readonly workspace: PostmanWorkspace,
    private readonly collectionUid: string,
  ) {}

  async run() {
    const {
      data: { collection },
    } = await this.postmanApi.collections.getCollection(this.collectionUid)

    await this.config.deleteCollectionResource(
      this.workspace,
      this.collectionUid,
    )

    this.config.writeCollectionResource(
      this.workspace,
      this.collectionUid,
      collection,
    )

    return { collection }
  }
}
