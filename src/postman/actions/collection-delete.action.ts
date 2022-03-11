import { PostmanAPI } from '../api'
import { TfsWorkspaceResourceManager } from '../../file-system'
import { IPMACAction } from './action.interface'
import { PMCollectionDeleteAction } from './pm-collection-delete.action'
import { PMACWorkspace } from '../../file-system/types'
import { PostmanCollection, WorkspaceResource } from '../api/types'
import { PMACCollectionGetPMACMapAction } from './pmac-collection-get-map.action'
import { PMACCollectionDeleteAction } from '.'

export class CollectionDeleteAction
implements IPMACAction<void> {
  constructor(
    private readonly fsWorkspaceResourceManager: TfsWorkspaceResourceManager,
    private postmanApi: PostmanAPI,
    private readonly pmacWorkspace: PMACWorkspace,
    private readonly pmacCollection: PostmanCollection,
  ) {}

  async run() {
    const pmacMap = await new PMACCollectionGetPMACMapAction(this.pmacWorkspace, this.pmacCollection).run()

    if (!pmacMap) {
      throw new Error(`pmac collection map not found for workspace '${this.pmacWorkspace.name}'.`)
    }

    await new PMCollectionDeleteAction(
      this.fsWorkspaceResourceManager,
      this.postmanApi,
      this.pmacWorkspace,
      {
        id: this.pmacCollection.info._postman_id,
        name: this.pmacCollection.info.name,
        uid: pmacMap.pmUID || '',
      }).run()

    await new PMACCollectionDeleteAction(this.fsWorkspaceResourceManager, {
      name: this.pmacCollection.info.name,
      type: WorkspaceResource.Collection,
      pmacID: pmacMap.pmacID,
      workspaceName: this.pmacWorkspace.name,
      workspaceType: this.pmacWorkspace.type,
      workspacePMACId: this.pmacWorkspace.pmacID,
    }).run()
  }
}
