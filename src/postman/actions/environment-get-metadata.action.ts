import { PMACWorkspace } from '../../file-system/types'
import { PMAC_MAP } from '../../file-system/types/pmac-map'
import { PostmanEnvironment } from '../api/types'
import { IPMACAction } from './action.interface'

export class EnvironmentGetMetadataAction
implements IPMACAction<PMAC_MAP | undefined> {
  constructor(
    private readonly pmacWorkspace: PMACWorkspace,
    private readonly environment: PostmanEnvironment,
  ) {}

  async run() {
    const environmentMetadata = this.pmacWorkspace.environments?.find(
      pmacE => pmacE.pmID === this.environment.id,
    )

    return environmentMetadata
  }
}
