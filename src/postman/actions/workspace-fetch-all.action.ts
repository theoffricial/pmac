import { IPmacAction } from './action.interface'
import { PostmanAPI } from '../api'
import {
  PostmanWorkspaceMetadata,
} from '../api/types/workspace.types'

export class WorkspaceFetchAllAction
implements IPmacAction<PostmanWorkspaceMetadata[]> {
  constructor(private readonly postmanApi: PostmanAPI) {}

  async run() {
    const {
      data: { workspaces: workspacesMetadata },
    } = await this.postmanApi.workspaces.getAllWorkspacesMetadata()

    return { workspacesMetadata }
  }
}
