import { PostmanAPI } from '../api'
import { PostmanWorkspaceMetadata } from '../api/types/workspace.types'
import { PmacConfigurationManager } from '../../file-system'
import { IPmacAction } from './action.interface'
import { WorkspaceDeleteLocalAction } from './workspace-delete-local.action'
import { WorkspaceDeleteRemoteAction } from './workspace-delete-remote.action'

export class WorkspaceDeleteAction
implements IPmacAction<Pick<PostmanWorkspaceMetadata, 'id'>> {
  constructor(
    private readonly config:PmacConfigurationManager,
    private readonly postmanApi: PostmanAPI,
    private readonly workspaceMetadata: PostmanWorkspaceMetadata,
  ) {}

  async run() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { deletedWorkspace } = await new WorkspaceDeleteRemoteAction(
      this.postmanApi,
      this.workspaceMetadata,
    ).run()

    const { deletedWorkspace: localDeletedWorkspace } =
      await new WorkspaceDeleteLocalAction(
        this.config,
        this.workspaceMetadata,
      ).run()

    return { deletedWorkspace: localDeletedWorkspace }
  }
}
