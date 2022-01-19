import { PostmanCollection } from '../api/types/collection.types'
import {
  PostmanWorkspaceMetadata,
} from '../api/types/workspace.types'
import { PmacConfigurationManager } from '../../file-system'
import { IPmacAction } from './action.interface'

export class CollectionDeleteLocalAction implements IPmacAction<PostmanCollection> {
  constructor(
    private config: PmacConfigurationManager,
    private readonly workspace: PostmanWorkspaceMetadata,
    private readonly collectionUid: string,
  ) {}

  async run(): Promise<{ deletedCollection: PostmanCollection }> {
    const { collection } = await this.config.getCollection(
      this.workspace,
      this.collectionUid,
    )
    await this.config.deleteCollectionResource(
      this.workspace,
      this.collectionUid,
    )
    return { deletedCollection: collection }
  }
}
