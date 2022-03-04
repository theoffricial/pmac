import { PostmanEnvironmentMetadata } from '../api/types'
import { IPMACAction } from './action.interface'
import { PostmanAPI } from '../api'
import { PMACWorkspace } from '../../file-system/types'

export class PMEnvironmentFetchAllAction
implements IPMACAction<PostmanEnvironmentMetadata[]> {
  constructor(
    private readonly postmanApi: PostmanAPI,
    private readonly pmacWorkspace: PMACWorkspace,
  ) {}

  async run() {
    const {
      data: { environments },
    } = await this.postmanApi.environments.getAllEnvironments()

    const pmacEnvironmentsUIDSet = new Set(this.pmacWorkspace.environments?.map(
      pmacE => pmacE.pmUID,
    ))

    const pmEnvironmentsMetadata = environments.filter(e =>
      pmacEnvironmentsUIDSet.has(e.uid),
    )
    return pmEnvironmentsMetadata
  }
}
