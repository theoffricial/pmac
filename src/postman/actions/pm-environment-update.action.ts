import { PostmanEnvironment, PostmanEnvironmentMinMetadata } from '../api/types'
import { IPMACAction } from './action.interface'
import { PostmanAPI } from '../api'
import { PMACWorkspace } from '../../file-system/types'
import { PMACEnvironmentGetPMACMapAction } from './pmac-environment-get-map.action'

export class PMEnvironmentUpdateAction implements IPMACAction<PostmanEnvironmentMinMetadata> {
  constructor(
    private readonly postmanApi: PostmanAPI,
    private readonly pmacWorkspace: PMACWorkspace,
    // private readonly pmEnvironmentUid: string,
    private readonly pmEnvironment: PostmanEnvironment,
  ) {}

  async run() {
    if (!this.pmacWorkspace.pmID) {
      throw new Error('pmac workspace id not found')
    }

    const pmacMap = await new PMACEnvironmentGetPMACMapAction(this.pmacWorkspace, this.pmEnvironment).run()

    if (!pmacMap || !pmacMap.pmUID) {
      throw new Error('pm environment uid not found in pmac workspace')
    }

    const { data: { environment: resetPMEnvironmentRes } } = await this.postmanApi.environments.updateEnvironment(
      pmacMap.pmUID,
      {
        name: this.pmEnvironment.name,
        values: [],
      },
    )

    const { data: { environment: newPMEnvironment } } = await this.postmanApi.environments.updateEnvironment(
      pmacMap.pmUID,
      {
        name: this.pmEnvironment.name,
        values: this.pmEnvironment.values,
      },
    )

    return newPMEnvironment
  }
}
