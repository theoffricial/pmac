
import { fsWorkspaceResourceManager } from '../../file-system'
import { IPMACAction } from './action.interface'
import { PMACWorkspaceResourceIDWithWID } from '../../file-system/types'

export class PMACCollectionDeleteAction implements IPMACAction {
  constructor(private readonly wrid: PMACWorkspaceResourceIDWithWID) {}
  async run() {
    await fsWorkspaceResourceManager.deletePMACWorkspaceResourceByWrid(this.wrid)
  }
}
