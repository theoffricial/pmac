import { PostmanAPI } from '../api'
import { PostmanWorkspaceMetadata } from '../api/types/workspace.types'
import { PmacConfigurationManager } from '../../file-system'
import { IPmacAction } from './action.interface'
import { EnvironmentDeleteLocalAction } from './environment-delete-local.action'
import { EnvironmentDeleteRemoteAction } from './environment-delete-remote.action'

export class EnvironmentDeleteAction
implements
  IPmacAction<{
    uid: string;
    id: string;
  }> {
  constructor(
    private config:PmacConfigurationManager,
    private postmanApi: PostmanAPI,
    private readonly workspaceMetadata: PostmanWorkspaceMetadata,
    private readonly environmentUid: string,
  ) {}

  async run() {
    const { deletedEnvironment } = await new EnvironmentDeleteRemoteAction(
      this.config,
      this.postmanApi,
      this.workspaceMetadata,
      this.environmentUid,
    ).run()

    await new EnvironmentDeleteLocalAction(
      this.config,
      this.workspaceMetadata,
      this.environmentUid,
    ).run()

    return { deletedEnvironment }
  }
}
