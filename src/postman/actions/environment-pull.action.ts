import { PostmanEnvironment } from '../api/types'
import { IPmacAction } from './action.interface'
import { PostmanAPI } from '../api'
import { PmacConfigurationManager } from '../../file-system'
import { PostmanWorkspace } from '../api/types/workspace.types'

export class EnvironmentPullAction implements IPmacAction<PostmanEnvironment> {
  constructor(
    private readonly config:PmacConfigurationManager,
    private readonly postmanApi: PostmanAPI,
    private readonly workspace: PostmanWorkspace,
    private readonly environmentUid: string,
  ) {}

  async run() {
    const {
      data: { environment },
    } = await this.postmanApi.environments.getEnvironment(this.environmentUid)

    // Removing existing env
    await this.config.deleteEnvironmentResource(
      this.workspace,
      this.environmentUid,
    )

    // writing updated env
    this.config.writeEnvironmentResource(
      this.workspace,
      this.environmentUid,
      environment,
    )

    return { environment }
  }
}
