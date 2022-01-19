import { PostmanAPI } from '../api'
import { PostmanWorkspaceMetadata } from '../api/types/workspace.types'
import { PostmanCollectionMetadata } from '../api/wrappers/collections.api'
import { PmacConfigurationManager } from '../../file-system'
import { IPmacAction } from './action.interface'
import { WorkspacePullAfterResourceUpdatedAction } from './workspace-pull-after-resource-updated.action'

export class CollectionDeleteRemoteAction
implements IPmacAction<PostmanCollectionMetadata> {
  constructor(
    private config:PmacConfigurationManager,
    private postmanApi: PostmanAPI,
    private readonly workspace: PostmanWorkspaceMetadata,
    private readonly collectionUid: string,
  ) {}

  async run(): Promise<{ deletedCollection: PostmanCollectionMetadata; }> {
    const {
      data: { collection },
    } = await this.postmanApi.collections.deleteCollection(this.collectionUid)

    // Updating workspace data
    await new WorkspacePullAfterResourceUpdatedAction(
      this.config,
      this.postmanApi,
      this.workspace.id,
    ).run()

    return { deletedCollection: collection }
  }
}
