import { PostmanEnvironment, PostmanEnvironmentMetadata } from '../api/types'
import { IPmacAction } from './action.interface'
import { PostmanAPI } from '../api'
import { PmacConfigurationManager } from '../../file-system'
import { PostmanWorkspace } from '../api/types/workspace.types'
import { WorkspacePullAfterResourceUpdatedAction } from './workspace-pull-after-resource-updated.action'
import { EnvironmentPullAction } from './environment-pull.action'

export class EnvironmentPushNewAction
implements IPmacAction<PostmanEnvironment> {
  constructor(
    private readonly config:PmacConfigurationManager,
    private readonly postmanApi: PostmanAPI,
    private readonly workspace: PostmanWorkspace,
    private readonly newEnvironment: Pick<PostmanEnvironment, 'name' | 'values'>,
  ) {}

  async run() {
    let bla = {} as PostmanEnvironmentMetadata
    try {
      const {
        data: { environment: environmentMetadata },
      } = await this.postmanApi.environments.createEnvironment(
        this.workspace.id,
        {
          name: this.newEnvironment.name,
          values: this.newEnvironment.values,
        },
      )
      bla = environmentMetadata
    } catch (error) {
      console.error(error)
    }

    // Updating workspace data
    await new WorkspacePullAfterResourceUpdatedAction(
      this.config,
      this.postmanApi,
      this.workspace.id,
    ).run()

    // Pull collection after updating
    const { environment } = await new EnvironmentPullAction(
      this.config,
      this.postmanApi,
      this.workspace,
      bla.uid,
    ).run()

    return { environment }
  }
}
