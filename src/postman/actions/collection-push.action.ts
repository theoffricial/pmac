import { IPmacAction } from './action.interface'
import { PostmanAPI } from '../api'
import { PmacConfigurationManager } from '../../file-system'
import { PostmanWorkspace } from '../api/types/workspace.types'
import { PostmanCollection } from '../api/types/collection.types'
import { CollectionPullAction } from './collection-pull.action'

export class CollectionPushAction implements IPmacAction<PostmanCollection> {
  constructor(
    private readonly config:PmacConfigurationManager,
    private readonly postmanApi: PostmanAPI,
    private readonly workspace: PostmanWorkspace,
    private readonly collectionUid: string,
    private readonly collection: PostmanCollection,
  ) {}

  async run() {
    const {
      data: { collection: collectionMetadata },
    } = await this.postmanApi.collections.updateCollection(
      this.collectionUid,
      {
        info: this.collection.info,
        item: this.collection.item,
        event: this.collection.event,
        variable: this.collection.variable,
      },
    )

    // post update
    const { collection } = await new CollectionPullAction(
      this.config,
      this.postmanApi,
      this.workspace,
      this.collectionUid,
    ).run()

    return { collection }
  }
}
