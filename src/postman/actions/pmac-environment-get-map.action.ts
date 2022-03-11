import { PMACWorkspace } from '../../file-system/types'
import { PMAC_MAP } from '../../file-system/types/pmac-map'
import { PostmanEnvironment } from '../api/types'
import { IPMACAction } from './action.interface'

export class PMACEnvironmentGetPMACMapAction
implements IPMACAction<PMAC_MAP | undefined> {
  constructor(
    private readonly pmacWorkspace: PMACWorkspace,
    private readonly pmEnvironment: PostmanEnvironment,
  ) {}

  async run() {
    const { id: pmID } = this.pmEnvironment
    const pmacMap = this.pmacWorkspace.environments.find(
      pmacE => pmacE.pmIDTmp === pmID || pmacE.pmID === pmID,
    )

    return pmacMap
  }
}
