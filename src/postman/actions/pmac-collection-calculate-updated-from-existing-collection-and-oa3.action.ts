/* eslint-disable unicorn/no-process-exit */
/* eslint-disable no-process-exit */
import { PostmanCollection } from '../api/types/collection.types'
import { getNewCollectionItemsFromOpenAPI } from '../../postman-to-openapi/update-collection/update-collection'
import { convertOA3toPMPromise } from '../../postman-to-openapi'
import { IPMACAction } from './action.interface'
import { PMACCollectionGetPMACMapAction } from './pmac-collection-get-map.action'
import { PMACWorkspace } from '../../file-system/types'
import { TfsWorkspaceManager, TfsWorkspaceResourceManager } from '../../file-system'
import { WorkspaceResource } from '../api/types'

export class PMACCollectionCalculateUpdatedFromExistingAndOA3Action
implements IPMACAction<void> {
  constructor(
    private readonly fsWorkspaceManager: TfsWorkspaceManager,
    private readonly fsWorkspaceResourceManager: TfsWorkspaceResourceManager,
    private readonly pmacWorkspace: PMACWorkspace,
    private readonly existingPMCollection: PostmanCollection,
    private readonly openApiSpecificationPath: string,
  ) {}

  async run() {
    const pmacCollectionMap = await new PMACCollectionGetPMACMapAction(
      this.pmacWorkspace,
      this.existingPMCollection,
    ).run()

    if (!pmacCollectionMap) {
      console.error('Collection not found.')
      process.exit(1)
    }

    const postmanCollectionSpecification: PostmanCollection =
      await convertOA3toPMPromise(
        {
          data: this.openApiSpecificationPath,
          type: 'file',
        },
        {},
      )

    const updatedCollectionItems = getNewCollectionItemsFromOpenAPI(
      this.existingPMCollection.item,
      postmanCollectionSpecification.item,
    )

    const updatedCollection: PostmanCollection = {
      ...postmanCollectionSpecification,
      item: updatedCollectionItems,
      info: {
        ...postmanCollectionSpecification.info,
        // eslint-disable-next-line camelcase
        _postman_id: this.existingPMCollection.info._postman_id,
      },
    }

    // save to files

    const pmacMap = this.pmacWorkspace.collections.find(pmacC => pmacC.pmID === this.existingPMCollection.info._postman_id)

    if (!pmacMap) {
      throw new Error('collection pmacMap not found')
    }

    await this.fsWorkspaceResourceManager.writeWorkspaceResourceDataJson({
      name: updatedCollection.info.name,
      type: WorkspaceResource.Collection,
      pmacID: pmacMap.pmacID,
      workspaceName: this.pmacWorkspace.name,
      workspacePMACId: this.pmacWorkspace.pmacID,
      workspaceType: this.pmacWorkspace.type,
      pmID: pmacMap.pmID,
      pmUID: pmacMap.pmUID,
    },
    updatedCollection,
    )

    // this.fsWorkspaceManager.writeWorkspaceDataJson()
  }
}
