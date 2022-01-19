import { PostmanAPI } from '../api'
import { PostmanWorkspaceMetadata } from '../api/types/workspace.types'
import { PostmanCollectionMetadata } from '../api/wrappers/collections.api'
import { PmacConfigurationManager } from '../../file-system'
import { IPmacAction } from './action.interface'
import { CollectionDeleteLocalAction } from './collection-delete-local.action'
import { CollectionDeleteRemoteAction } from './collection-delete-remote.action'

export class CollectionDeleteAction
implements IPmacAction<PostmanCollectionMetadata> {
  constructor(
    private config: PmacConfigurationManager,
    private postmanApi: PostmanAPI,
    private readonly workspace: PostmanWorkspaceMetadata,
    private readonly collectionUid: string,
  ) {}

  async run(): Promise<{ deletedCollection: PostmanCollectionMetadata; }> {
    const { deletedCollection } = await new CollectionDeleteRemoteAction(
      this.config,
      this.postmanApi,
      this.workspace,
      this.collectionUid,
    ).run()

    await new CollectionDeleteLocalAction(
      this.config,
      this.workspace,
      this.collectionUid,
    ).run()

    return { deletedCollection }
  }
}
