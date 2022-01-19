import { PostmanEnvironmentMetadata } from '../api/types'
import { IPmacAction } from './action.interface'
import { PostmanAPI } from '../api'
import {
  PostmanWorkspace,
} from '../api/types/workspace.types'

export class EnvironmentFetchAllAction
implements IPmacAction<PostmanEnvironmentMetadata[]> {
  constructor(
    private readonly postmanApi: PostmanAPI,
    private readonly workspace: PostmanWorkspace,
  ) {}

  async run() {
    const {
      data: { environments },
    } = await this.postmanApi.environments.getAllEnvironments()

    const workspaceEnvironments = new Set(this.workspace.environments.map(
      workspaceEnvironment => workspaceEnvironment.uid,
    ))

    const workspaceEnvs = environments.filter(e =>
      workspaceEnvironments.has(e.uid),
    )
    return { environmentsMetadata: workspaceEnvs }
  }
}
