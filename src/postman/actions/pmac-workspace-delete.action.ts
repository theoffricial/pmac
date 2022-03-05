import { TfsWorkspaceManager } from '../../file-system'
import { IPMACAction } from './action.interface'
import { PMACWorkspaceID } from '../../file-system/types'

export class PMACWorkspaceDeleteAction implements IPMACAction  {
  constructor(
    private readonly fsWorkspaceManager: TfsWorkspaceManager,
    private readonly wid: PMACWorkspaceID) {}

  async run() {
    await this.fsWorkspaceManager.deletePMACWorkspaceByWid(this.wid)
  }
}
