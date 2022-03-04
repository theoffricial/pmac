import { IPMACAction, IPmacAction } from './action.interface'
import { PostmanAPI } from '../api'
import {
  PostmanWorkspace,
} from '../api/types/workspace.types'
import { PostmanCollectionMetadata } from '../api/wrappers/collections.api'
import { PMACWorkspace } from '../../file-system/types'

export class PMCollectionFetchAllAction
implements IPMACAction<PostmanCollectionMetadata[]> {
  constructor(
    private readonly postmanApi: PostmanAPI,
    private readonly pmacWorkspace: PMACWorkspace,
  ) {}

  async run() {
    const {
      data: { collections },
    } = await this.postmanApi.collections.getAllCollectionsMetadata()

    const existingCollections = new Set(this.pmacWorkspace.collections?.map(c => c.pmUID))

    const pmacCollections = collections.filter(pmC =>
      existingCollections.has(pmC.uid),
    )

    return pmacCollections
  }
}
