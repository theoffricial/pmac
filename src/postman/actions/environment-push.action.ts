import { PostmanEnvironment } from '../api/types'
import { IPmacAction } from './action.interface'
import { PostmanAPI } from '../api'
import { PmacConfigurationManager } from '../../file-system'
import { PostmanWorkspace } from '../api/types/workspace.types'
import { EnvironmentPullAction } from './environment-pull.action'
import { EnvironmentPushNewAction } from './environment-push-new.action'

export class EnvironmentPushAction implements IPmacAction<PostmanEnvironment> {
  constructor(
    private readonly config:PmacConfigurationManager,
    private readonly postmanApi: PostmanAPI,
    private readonly workspace: PostmanWorkspace,
    private readonly environmentUid: string,
    private readonly environment: PostmanEnvironment,
  ) {}

  async run(): Promise<{ environment: PostmanEnvironment; }> {
    // TODO: Add retry or queue mechanisms
    try {
      // Update to reset - because environments update only for "initial value" but not for the current one.
      const {
        data: { environmentMinMetadata: environmentResetResopnse },
      } = await this.postmanApi.environments.updateEnvironment(
        this.environmentUid,
        {
          name: this.environment.name,
          values: [],
        },
      )
    } catch {
      // When updates fails, try to create the environment
      // Manage this error somehow
      const { environment: createdEnvironment } = await new EnvironmentPushNewAction(this.config, this.postmanApi, this.workspace, {
        name: this.environment.name,
        values: this.environment.values,
      }).run()
    }

    // If succeed, request the real update
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
