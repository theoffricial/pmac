import { PostmanAPI } from '../api'
import { PostmanCollectionMetadata } from '../api/wrappers/collections.api'
import { TfsWorkspaceResourceManager } from '../../file-system'
import { IPMACAction } from './action.interface'
import { PMCollectionDeleteAction } from './pm-collection-delete.action'
import { PMACWorkspace } from '../../file-system/types'

export class CollectionDeleteAction
implements IPMACAction<void> {
  constructor(
    private readonly fsWorkspaceResourceManager: TfsWorkspaceResourceManager,
    private postmanApi: PostmanAPI,
    private readonly pmacWorkspace: PMACWorkspace,
    private readonly pmCollectionMetadata: PostmanCollectionMetadata,
  ) {}

  async run() {
    const { deletedPMCollectionId, deletedPMCollectionUid } = await new PMCollectionDeleteAction(
      this.fsWorkspaceResourceManager,
      this.postmanApi,
      this.pmacWorkspace,
      this.pmCollectionMetadata,
    ).run()

    // await new PMACCollectionDeleteAction(
    //   this.fsWorkspaceResourceManager,
    //   this.pmacWorkspace,
    //   this.pmCollectionMetadata,
    // ).run()

    // return { deletedPMCollectionId, deletedPMCollectionUid }
  }
}
