import { PostmanEnvironment } from '../api/types'
import { PostmanWorkspaceMetadata } from '../api/types/workspace.types'
import { PmacConfigurationManager } from '../../file-system'
import { IPmacAction } from './action.interface'

export class EnvironmentDeleteLocalAction
implements IPmacAction<PostmanEnvironment> {
  constructor(
    private config:PmacConfigurationManager,
    private readonly workspace: PostmanWorkspaceMetadata,
    private readonly environmentUid: string,
  ) {}

  async run() {
    const { environment } = await this.config.getEnvironment(
      this.workspace,
      this.environmentUid,
    )
    await this.config.deleteEnvironmentResource(
      this.workspace,
      this.environmentUid,
    )
    return { deletedEnvironment: environment }
  }
}
