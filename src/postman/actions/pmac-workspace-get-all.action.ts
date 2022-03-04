import { IPMACAction } from './action.interface'
import { WorkspaceType } from '../api/types/workspace.types'
import { TfsWorkspaceManager } from '../../file-system'
import { PMACWorkspace } from '../../file-system/types'

export class PMACWorkspaceGetAllAction
implements IPMACAction<PMACWorkspace[]> {
  constructor(
    private readonly _fsWorkspaceManager: TfsWorkspaceManager,
    private readonly type?: WorkspaceType,
  ) {}

  async run() {
    const pmacWorkspaces = await this._fsWorkspaceManager.getAllPMACWorkspaces(this.type)

    return pmacWorkspaces
  }
}
