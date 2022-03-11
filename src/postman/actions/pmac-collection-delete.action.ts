
import { TfsWorkspaceResourceManager } from '../../file-system'
import { IPMACAction } from './action.interface'
import { PMACWorkspaceResourceIDWithWID } from '../../file-system/types'

export class PMACCollectionDeleteAction implements IPMACAction {
  constructor(
    private readonly fsWorkspaceResourceManager: TfsWorkspaceResourceManager,
    private readonly wrid: PMACWorkspaceResourceIDWithWID) {}

  async run() {
    await this.fsWorkspaceResourceManager.deletePMACWorkspaceResourceByWrid(this.wrid)
  }
}
