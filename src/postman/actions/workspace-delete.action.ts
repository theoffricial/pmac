import { PostmanAPI } from '../api'
import { PMACWorkspaceDeleteAction } from './pmac-workspace-delete.action'
import { PMWorkspaceDeleteAction } from './pm-workspace-delete.action'
import { PMACWorkspaceID } from '../../file-system/types'
import { IPMACAction } from './action.interface'
import { TfsWorkspaceManager } from '../../file-system'

export class WorkspaceDeleteAction
implements IPMACAction<{ deletedPMWorkspaceId: string }> {
  constructor(
    private readonly wid: PMACWorkspaceID,
    private readonly fsWorkspaceManager: TfsWorkspaceManager,
    private readonly postmanApi: PostmanAPI,
  ) {}

  async run() {
    const { deletedPMWorkspaceId } = await new PMWorkspaceDeleteAction(
      this.postmanApi,
      this.wid,
    ).run()

    await new PMACWorkspaceDeleteAction(
      this.fsWorkspaceManager,
      this.wid,
    ).run()

    return { deletedPMWorkspaceId }
  }
}
