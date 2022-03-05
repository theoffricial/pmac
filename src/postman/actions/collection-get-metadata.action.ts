import { PMACWorkspace } from '../../file-system/types'
import { PMAC_MAP } from '../../file-system/types/pmac-map'
import { PostmanCollection } from '../api/types/collection.types'
import { IPMACAction } from './action.interface'

export class PMACCollectionGetPMACMapAction
implements IPMACAction<PMAC_MAP | undefined> {
  constructor(
    private readonly pmacWorkspace: PMACWorkspace,
    private readonly pmCollection: PostmanCollection,
  ) {}

  async run() {
    const { _postman_id: pmID } = this.pmCollection.info
    const pmacMap = this.pmacWorkspace.collections.find(
      pmacC => pmacC.pmacID === pmID || pmacC.pmID === pmID,
    )

    return pmacMap
  }
}
