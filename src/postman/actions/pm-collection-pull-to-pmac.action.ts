import { IPMACAction, IPmacAction } from './action.interface'
import { PostmanAPI } from '../api'
import { WorkspaceResource } from '../api/types/workspace.types'
import { PostmanCollection } from '../api/types/collection.types'
import { PMACMap, TfsWorkspaceResourceManager } from '../../file-system'
import { PMACWorkspace, PMACWorkspaceResourceIDWithWID } from '../../file-system/types'
import { PMCollectionFetchAction } from '.'

export class CollectionPullAction implements IPMACAction<PostmanCollection> {
  constructor(
    private readonly fsWorkspaceResourceManager: TfsWorkspaceResourceManager,
    private readonly postmanApi: PostmanAPI,
    private readonly pmacWorkspace: PMACWorkspace,
    private readonly pmCollectionUid: string,
  ) {}

  async run() {
    // Get collection
    const pmCollection = await new PMCollectionFetchAction(this.postmanApi, this.pmCollectionUid).run()

    const wrid: PMACWorkspaceResourceIDWithWID = {
      pmacID: PMACMap.generatePMACuuid(),
      pmUID: this.pmCollectionUid,
      pmID: pmCollection.info?._postman_id || '',
      name: pmCollection.info?.name || '',
      type: WorkspaceResource.Collection,
      workspaceName: this.pmacWorkspace.name,
      workspaceType: this.pmacWorkspace.type,
      workspacePMACId: this.pmacWorkspace.pmacID,
    }

    const pmacResource = this.pmacWorkspace.collections?.find(c => c.pmUID === this.pmCollectionUid)
    if (pmacResource) {
      const existingWrid = await this.fsWorkspaceResourceManager.getPMACWridWithoutName({
        pmacID: pmacResource.pmacID,
        type: WorkspaceResource.Collection,
        workspaceName: this.pmacWorkspace.name,
        workspaceType: this.pmacWorkspace.type,
        workspacePMACId: this.pmacWorkspace.pmacID,
      })

      if (existingWrid) {
        // keep the same pmacID
        wrid.pmacID = existingWrid.pmacID
        await this.fsWorkspaceResourceManager.deletePMACWorkspaceResourceFile(existingWrid)
      }
    }

    await this.fsWorkspaceResourceManager.writeWorkspaceResourceDataJson(wrid, pmCollection)

    return pmCollection
  }
}
