import { IPMACAction } from './action.interface'
import { PostmanAPI } from '../api'
import { PostmanWorkspace } from '../api/types/workspace.types'

export class PMWorkspaceFetchAction implements IPMACAction<PostmanWorkspace> {
  constructor(
    private readonly postmanApi: PostmanAPI,
    private readonly pmWorkspaceId: string,
  ) {}

  async run() {
    try {
      const {
        data: { workspace: pmWorkspace },
      } = await this.postmanApi.workspaces.getWorkspaceData(this.pmWorkspaceId)

      return pmWorkspace
    } catch {
      // console.error(error)
      throw new Error(`Error while try to fetch workspace ${this.pmWorkspaceId} from Postman.`)
    }
  }
}
