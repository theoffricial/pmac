import { PostmanEnvironment } from '../api/types'
import { IPmacAction } from './action.interface'
import { PostmanAPI } from '../api'
import { PmacConfigurationManager } from '../../file-system'
import { PostmanWorkspace } from '../api/types/workspace.types'
import { EnvironmentPullAction } from './environment-pull.action'

export class EnvironmentPushAction implements IPmacAction<PostmanEnvironment> {
  constructor(
    private readonly config:PmacConfigurationManager,
    private readonly postmanApi: PostmanAPI,
    private readonly workspace: PostmanWorkspace,
    private readonly environmentUid: string,
    private readonly environment: PostmanEnvironment,
  ) {}

  async run() {
    const {
      data: { environmentMinMetadata: updatedEnvironment },
    } = await this.postmanApi.environments.updateEnvironment(
      this.environmentUid,
      {
        name: this.environment.name,
        values: this.environment.values,
      },
    )

    // post update
    const { environment } = await new EnvironmentPullAction(
      this.config,
      this.postmanApi,
      this.workspace,
      this.environmentUid,
    ).run()

    return { environment }
  }
}
