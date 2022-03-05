import { PMACWorkspaceID } from '../../file-system/types'
import { PostmanAPI } from '../api'
import { IPMACAction } from './action.interface'

export class PMWorkspaceDeleteAction implements IPMACAction<{ deletedPMWorkspaceId: string }> {
  constructor(
    private readonly postmanApi: PostmanAPI,
    private readonly wid: PMACWorkspaceID) {}

  async run() {
    if (!this.wid.pmID) {
      throw new Error('pmac has no map for this workspace')
    }

    const { data: { workspace: { id } } } = await this.postmanApi.workspaces.deleteWorkspace(this.wid.pmID)

    return { deletedPMWorkspaceId: id }
  }
}
