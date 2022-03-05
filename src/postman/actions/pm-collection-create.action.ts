import { IPMACAction } from './action.interface'
import { PostmanAPI } from '../api'
import { PostmanCollection } from '../api/types/collection.types'
import { PMACWorkspace } from '../../file-system/types'
// import { TfsWorkspaceManager, TfsWorkspaceResourceManager } from '../../file-system'
import { PostmanCollectionMetadata } from '../api/wrappers/collections.api'
import { TfsWorkspaceManager, TfsWorkspaceResourceManager } from '../../file-system'
import { PMCollectionFetchAction } from '.'
import { WorkspaceResource } from '../api/types'
// import { WorkspacePullAfterResourceUpdatedAction } from './workspace-pull-after-resource-updated.action'

export class PMCollectionCreateAction implements IPMACAction<PostmanCollectionMetadata> {
  constructor(
    private readonly fsWorkspaceManager: TfsWorkspaceManager,
    private readonly fsWorkspaceResourceManager: TfsWorkspaceResourceManager,
    private readonly pmApi: PostmanAPI,
    private readonly pmacWorkspace: PMACWorkspace,
    private readonly pmCollection: PostmanCollection,
  ) {}

  async run() {
    if (!this.pmacWorkspace.pmID) {
      throw new Error('pmac workspace id not found')
    }

    const {
      data: { collection: pmCollectionMetadata },
    } = await this.pmApi.collections.createCollection(this.pmacWorkspace.pmID, {
      info: {
        name: this.pmCollection.info.name,
        schema: this.pmCollection.info.schema,
        description: this.pmCollection.info.description,
      },
      item: this.pmCollection.item,
      event: this.pmCollection.event,
      variable: this.pmCollection.variable,
    }).catch(error => {
      console.log(error.config?.data?.error?.message)
      throw error
    })

    const pmacMap = this.pmacWorkspace.collections.find(
      pmacC => pmacC.pmID === this.pmCollection.info._postman_id ||
      pmacC.pmIDTmp === this.pmCollection.info._postman_id)

    if (!pmacMap) {
      throw new Error('pmac collection pmID not found')
    }

    const pmCollection = await new PMCollectionFetchAction(
      this.pmApi,
      pmCollectionMetadata.uid,
    ).run()

    await this.fsWorkspaceResourceManager.writeWorkspaceResourceDataJson({
      name: pmCollection.info.name,
      pmacID: pmacMap.pmacID,
      type: WorkspaceResource.Collection,
      workspaceName: this.pmacWorkspace.name,
      workspacePMACId: this.pmacWorkspace.pmacID,
      workspaceType: this.pmacWorkspace.type,
    }, pmCollection)

    // reassign with real PM values
    pmacMap.pmID = pmCollectionMetadata.id
    pmacMap.pmUID = pmCollectionMetadata.uid
    // remove pmID place holder tmp uuid
    delete pmacMap.pmIDTmp

    this.fsWorkspaceManager.writeWorkspaceDataJson(this.pmacWorkspace)

    return pmCollectionMetadata
  }
}
