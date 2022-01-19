import { IPmacAction } from './action.interface'
import { PostmanAPI } from '../api'
import { PostmanWorkspace } from '../api/types/workspace.types'

export class WorkspaceFetchAction implements IPmacAction<PostmanWorkspace> {
  constructor(
    private readonly postmanApi: PostmanAPI,
    private readonly workspaceId: string,
  ) {}

  async run() {
    const {
      data: { workspace },
    } = await this.postmanApi.workspaces.getWorkspaceData(this.workspaceId)

    return { workspace }
  }
}
