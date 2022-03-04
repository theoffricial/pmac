import { PostmanAPI } from '../api'
import { WorkspaceResource } from '../api/types/workspace.types'
import { PostmanCollectionMetadata } from '../api/wrappers/collections.api'
import { TfsWorkspaceResourceManager } from '../../file-system'
import { IPMACAction } from './action.interface'
import { PMACWorkspace } from '../../file-system/types'

export class PMCollectionDeleteAction
implements IPMACAction<{ deletedPMCollectionUid: string; deletedPMCollectionId: string }> {
  constructor(
    private readonly fsWorkspaceResourceManager: TfsWorkspaceResourceManager,
    private postmanApi: PostmanAPI,
    private readonly pmacWorkspace: PMACWorkspace,
    private readonly pmCollectionMetadata: PostmanCollectionMetadata,
  ) {}

  async run() {
    const pmacMap = this.pmacWorkspace.environments?.find(pmacE => pmacE.pmUID === this.pmCollectionMetadata.uid)

    if (!pmacMap) {
      throw new Error(`pm environment uid:${this.pmCollectionMetadata.uid} not found in your pmac workspace`)
    }

    const {
      data: { collection: pmCollection },
    } = await this.postmanApi.collections.deleteCollection(this.pmCollectionMetadata.uid)

    this.fsWorkspaceResourceManager.cleanPMIDsFromPMACWorkspaceResourceRecordFromPMACWorkspace({
      name: this.pmCollectionMetadata.name,
      pmacID: pmacMap.pmacID,
      type: WorkspaceResource.Collection,
      workspaceName: this.pmacWorkspace.name,
      workspacePMACId: this.pmacWorkspace.pmacID,
      workspaceType: this.pmacWorkspace.type,
    })

    return { deletedPMCollectionUid: pmCollection.uid, deletedPMCollectionId: pmCollection.id }
  }
}
