import { PostmanAPI } from '../api'
import { PostmanWorkspaceMetadata } from '../api/types/workspace.types'
import { PmacConfigurationManager } from '../../file-system'
import { IPmacAction } from './action.interface'
import { WorkspacePullAfterResourceUpdatedAction } from './workspace-pull-after-resource-updated.action'

export class EnvironmentDeleteRemoteAction
implements IPmacAction<{ uid: string; id: string }> {
  constructor(
    private config:PmacConfigurationManager,
    private postmanApi: PostmanAPI,
    private readonly workspace: PostmanWorkspaceMetadata,
    private readonly environmentUid: string,
  ) {}

  async run() {
    const {
      data: { environment },
    } = await this.postmanApi.environments.deleteEnvironment(
      this.environmentUid,
    )

    // Updating workspace data
    await new WorkspacePullAfterResourceUpdatedAction(
      this.config,
      this.postmanApi,
      this.workspace.id,
    ).run()

    return { deletedEnvironment: environment }
  }
}
