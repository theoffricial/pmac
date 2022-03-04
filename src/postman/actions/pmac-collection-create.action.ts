import { IPMACAction } from './action.interface'
import { PostmanCollection } from '../api/types/collection.types'
import { PMACWorkspace } from '../../file-system/types'
import { PMACMap, TfsWorkspaceManager, TfsWorkspaceResourceManager } from '../../file-system'
import { WorkspaceResource } from '../api/types'

export class PMACCollectionCreateAction implements IPMACAction<void> {
  constructor(
    private readonly pmacWorkspace: PMACWorkspace,
    private readonly pmCollection: PostmanCollection,
    private readonly fsWorkspaceManager: TfsWorkspaceManager,
    private readonly fsWorkspaceResourceManager: TfsWorkspaceResourceManager,
    // Optional, only when created with push
    private readonly pmCollectionUid?: string,
  ) {}

  async run() {
    if (!this.pmacWorkspace.pmacID) {
      throw new Error('pmac workspace id not found')
    }

    const pmacID = PMACMap.generatePMACuuid()

    await this.fsWorkspaceResourceManager.writeWorkspaceResourceDataJson({
      name: this.pmCollection.info.name,
      type: WorkspaceResource.Collection,
      pmacID,
      workspaceName: this.pmacWorkspace.name,
      workspacePMACId: this.pmacWorkspace.pmacID,
      workspaceType: this.pmacWorkspace.type,
      pmID: this.pmCollection.info._postman_id,
      pmUID: this.pmCollectionUid || '',
    }, this.pmCollection)

    this.pmacWorkspace.collections.push({ pmacID, pmID: this.pmCollection.info._postman_id, pmUID: '' })

    await this.fsWorkspaceManager.writeWorkspaceDataJson(this.pmacWorkspace)
  }
}
