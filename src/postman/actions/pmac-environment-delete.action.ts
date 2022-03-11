import { TfsWorkspaceResourceManager } from '../../file-system'
import { IPMACAction } from './action.interface'
import { PMACWorkspaceResourceIDWithWID } from '../../file-system/types'

export class PMACEnvironmentDeleteAction
implements IPMACAction<void> {
  constructor(
    private readonly fsWorkspaceResourceManager: TfsWorkspaceResourceManager,
    private readonly wrid: PMACWorkspaceResourceIDWithWID,
  ) {}

  async run() {
    await this.fsWorkspaceResourceManager.deletePMACWorkspaceResourceByWrid(this.wrid)
  }
}
