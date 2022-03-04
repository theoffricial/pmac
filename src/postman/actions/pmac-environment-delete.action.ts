import { WorkspaceResource } from '../api/types/workspace.types'
import { TfsWorkspaceResourceManager } from '../../file-system'
import { IPMACAction } from './action.interface'
import { PMACWorkspace } from '../../file-system/types'
import { PostmanEnvironmentMetadata } from '../api/types'

export class PMACEnvironmentDeleteAction
implements IPMACAction<{ deletedPMACID: string }> {
  constructor(
    private readonly fsWorkspaceResourceManager: TfsWorkspaceResourceManager,
    private readonly pmacWorkspace: PMACWorkspace,
    private readonly pmEnvironmentMetadata: PostmanEnvironmentMetadata,
  ) {}

  async run() {
    const pmacMap = this.pmacWorkspace.environments?.find(pmacE => pmacE.pmUID === this.pmEnvironmentMetadata.uid)
    if (!pmacMap) {
      throw new Error('PMAC environment not found')
    }

    await this.fsWorkspaceResourceManager.deletePMACWorkspaceResourceByWridWithoutName({
      pmacID: pmacMap.pmacID,
      type: WorkspaceResource.Environment,
      pmUID: pmacMap.pmUID,
      workspaceName: this.pmacWorkspace.name,
      workspacePMACId: this.pmacWorkspace.pmacID,
      workspaceType: this.pmacWorkspace.type,
    })

    return { deletedPMACID: pmacMap.pmacID }
  }
}
