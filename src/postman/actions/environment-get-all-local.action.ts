import { IPmacAction } from './action.interface'
import { PostmanWorkspaceMetadata } from '../api/types/workspace.types'
import { PmacConfigurationManager } from '../../file-system'
import { PostmanEnvironment } from '../api/types'

export class EnvironmentGetAllLocalAction
implements IPmacAction<PostmanEnvironment[]> {
  constructor(
    private readonly config:PmacConfigurationManager,
    private readonly workspaceMetadata: PostmanWorkspaceMetadata,
  ) {}

  async run() {
    const { localEnvironments } = await this.config.getWorkspaceEnvironments(
      this.workspaceMetadata,
    )

    return { localEnvironments }
  }
}
