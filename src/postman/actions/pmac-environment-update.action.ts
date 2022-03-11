import { PostmanEnvironment, WorkspaceResource } from '../api/types'
import { IPMACAction } from './action.interface'
import { TfsWorkspaceManager, TfsWorkspaceResourceManager } from '../../file-system'
import { PMACWorkspace } from '../../file-system/types'
import { PMACEnvironmentGetPMACMapAction } from './pmac-environment-get-map.action'

export class PMACEnvironmentUpdateAction
implements IPMACAction<void> {
  constructor(
    private readonly fsWorkspaceManager: TfsWorkspaceManager,
    private readonly fsWorkspaceResourceManager: TfsWorkspaceResourceManager,
    private readonly pmacWorkspace: PMACWorkspace,
    private readonly PMACEnvironmentToUpdate: PostmanEnvironment,
  ) {}

  async run() {
    if (!this.pmacWorkspace.pmacID) {
      throw new Error('pmac workspace id not found')
    }

    const pmacMap = await new PMACEnvironmentGetPMACMapAction(this.pmacWorkspace, this.PMACEnvironmentToUpdate).run()

    if (!pmacMap) {
      throw new Error(`pmac environment not found for workspace '${this.pmacWorkspace.name}'.`)
    }

    if (!pmacMap.pmID && !pmacMap.pmIDTmp) {
      throw new Error(`pmac environment 'id' identifier, pmID or pmIDTmp, not found for workspace '${this.pmacWorkspace.name}'.`)
    }

    const envPMID = pmacMap.pmID || pmacMap.pmIDTmp || ''

    // update
    await this.fsWorkspaceResourceManager.writeWorkspaceResourceDataJson<WorkspaceResource.Environment>({
      name: this.PMACEnvironmentToUpdate.name,
      type: WorkspaceResource.Environment,
      pmacID: pmacMap.pmacID,
      pmIDTmp: pmacMap.pmIDTmp,
      workspaceName: this.pmacWorkspace.name,
      workspacePMACId: this.pmacWorkspace.pmacID,
      workspaceType: this.pmacWorkspace.type,
    }, {
      values: this.PMACEnvironmentToUpdate.values,
      name: this.PMACEnvironmentToUpdate.name,
      // tmp - for easy matching before pushing to PM
      id: envPMID,
      createdAt: this.PMACEnvironmentToUpdate.createdAt,
      isPublic: this.PMACEnvironmentToUpdate.isPublic,
      owner: this.PMACEnvironmentToUpdate.owner,
      updatedAt: new Date().toISOString(),
    })
  }
}
