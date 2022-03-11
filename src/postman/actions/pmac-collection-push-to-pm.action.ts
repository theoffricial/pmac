import { IPMACAction } from './action.interface'
import { PostmanAPI } from '../api'
import { PostmanCollection } from '../api/types/collection.types'
import { PMACWorkspace } from '../../file-system/types'
import { PostmanCollectionMetadata } from '../api/wrappers/collections.api'
import { TfsWorkspaceManager, TfsWorkspaceResourceManager } from '../../file-system'
import { PMACCollectionCreateAction } from './pmac-collection-create.action'
import { PMCollectionCreateAction } from '.'

interface CollectionPushOptions {
  create?: boolean;
}

export class CollectionPushAction implements IPMACAction<PostmanCollectionMetadata> {
  constructor(
    private readonly fsWorkspaceManager: TfsWorkspaceManager,
    private readonly fsWorkspaceResourceManager: TfsWorkspaceResourceManager,
    private readonly pmApi: PostmanAPI,
    private readonly pmacWorkspace: PMACWorkspace,
    private readonly collectionUid: string,
    private readonly pmCollection: PostmanCollection,
    private readonly options?: CollectionPushOptions,
  ) {}

  async run() {
    if (!this.pmacWorkspace.pmID) {
      throw new Error('pmac workspace pmID not found, workspace should push before.')
    }

    let pmCollectionMetadata: PostmanCollectionMetadata

    try {
      console.log(`Trying to push collection '${this.pmCollection.info.name}' with update action..`)
      const { data: { collection } } = await this.pmApi.collections.updateCollection(
        this.collectionUid,
        {
          info: this.pmCollection.info,
          item: this.pmCollection.item,
          event: this.pmCollection.event,
          variable: this.pmCollection.variable,
        },
      )
      pmCollectionMetadata = collection
    } catch {
      console.log(`Trying to push collection ${this.pmCollection.info.name} with create action..`)
      const collection = await new PMCollectionCreateAction(
        this.fsWorkspaceManager,
        this.fsWorkspaceResourceManager,
        this.pmApi,
        this.pmacWorkspace,
        this.pmCollection,
      ).run()

      pmCollectionMetadata = collection
      // await new PMACCollectionCreateAction(
      //   this.pmacWorkspace,
      //   this.pmCollection,
      //   this.fsWorkspaceManager,
      //   this.fsWorkspaceResourceManager,
      // ).run()

      // const pmacMap = this.pmacWorkspace.collections?.find(pmacC => pmacC.pmUID === pmCollectionMetadata.uid)
      // if (!pmacMap) {
      //   throw new Error('pmacMap not found')
      // }

      // pmacMap.pmUID = pmCollectionMetadata.uid

      // this.fsWorkspaceManager.writeWorkspaceDataJson(this.pmacWorkspace)
    }

    // post update
    // const { collection } = await new CollectionPullAction(
    //   this.config,
    //   this.pmApi,
    //   this.pmacWorkspace,
    //   this.collectionUid,
    // ).run()

    return pmCollectionMetadata
  }
}
