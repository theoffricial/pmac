import { PostmanAPI } from '../api'
import { PostmanWorkspaceMetadata } from '../api/types/workspace.types'
import { IPmacAction } from './action.interface'

export class WorkspaceDeleteRemoteAction
implements IPmacAction<Pick<PostmanWorkspaceMetadata, 'id'>> {
  constructor(
    private readonly postmanApi: PostmanAPI,
    private readonly workspace: PostmanWorkspaceMetadata,
  ) {}

  async run() {
    const {
      data: {
        workspace: { id },
      },
    } = await this.postmanApi.workspaces.deleteWorkspace(this.workspace.id)
    return { deletedWorkspace: { id } }
  }
}
