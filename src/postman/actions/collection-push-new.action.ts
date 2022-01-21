import { IPmacAction } from './action.interface'
import { PostmanAPI } from '../api'
import { PmacConfigurationManager } from '../../file-system'
import { PostmanWorkspace } from '../api/types/workspace.types'
import { PostmanCollection } from '../api/types/collection.types'
import { CollectionPullAction } from './collection-pull.action'
import { WorkspacePullAfterResourceUpdatedAction } from './workspace-pull-after-resource-updated.action'

export class CollectionPushNewAction implements IPmacAction<PostmanCollection> {
  constructor(
    private readonly config:PmacConfigurationManager,
    private readonly postmanApi: PostmanAPI,
    private readonly workspace: PostmanWorkspace,
    private readonly collection: PostmanCollection,
  ) {}

  async run(): Promise<{ collection: PostmanCollection; }> {
    const {
      data: { collection: collectionMetadata },
    } = await this.postmanApi.collections.createCollection(this.workspace.id, {
      info: {
        name: this.collection.info.name,
        schema: this.collection.info.schema,
        description: this.collection.info.description,
      },
      item: this.collection.item,
      event: this.collection.event,
      variable: this.collection.variable,
    })

    // Updating workspace data
    await new WorkspacePullAfterResourceUpdatedAction(
      this.config,
      this.postmanApi,
      this.workspace.id,
    ).run()

    // Pull collection after updating
    const { collection } = await new CollectionPullAction(
      this.config,
      this.postmanApi,
      this.workspace,
      collectionMetadata.uid,
    ).run()

    return { collection }
  }
}
