import { IPmacAction } from './action.interface'
import { PostmanAPI } from '../api'
import {
  PostmanWorkspaceMetadata,
} from '../api/types/workspace.types'

export class PMWorkspaceFetchAllAction
implements IPmacAction<PostmanWorkspaceMetadata[]> {
  constructor(private readonly postmanApi: PostmanAPI) {}

  async run() {
    const {
      data: { workspaces: pmWorkspacesMetadata },
    } = await this.postmanApi.workspaces.getAllWorkspacesMetadata()

    return { pmWorkspacesMetadata }
  }
}
