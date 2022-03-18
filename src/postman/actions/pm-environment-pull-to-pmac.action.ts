import { PostmanEnvironment } from '../api/types'
import { IPMACAction } from './action.interface'
import { PostmanAPI } from '../api'
import {  PMACMap, TfsWorkspaceResourceManager } from '../../file-system'
import { WorkspaceResource } from '../api/types/workspace.types'
import { PMEnvironmentFetchAction } from '.'
import { PMACWorkspace, PMACWorkspaceResourceIDWithWID } from '../../file-system/types'

export class PMEnvironmentPullToPMACAction implements IPMACAction<PostmanEnvironment> {
  constructor(
    private readonly fsWorkspaceResourceManager: TfsWorkspaceResourceManager,
    private readonly postmanApi: PostmanAPI,
    private readonly pmacWorkspace: PMACWorkspace,
    private readonly pmEnvironmentUid: string,
  ) {}

  async run() {
    const pmEnvironment = await new PMEnvironmentFetchAction(this.postmanApi, this.pmEnvironmentUid).run()

    const wrid: PMACWorkspaceResourceIDWithWID = {
      // generate new, but might be overwrite by existing pmacID
      pmacID: PMACMap.generatePMACuuid(),
      pmUID: this.pmEnvironmentUid,
      pmID: pmEnvironment.id || '',
      name: pmEnvironment.name || '',
      type: WorkspaceResource.Environment,
      workspaceName: this.pmacWorkspace.name,
      workspaceType: this.pmacWorkspace.type,
      workspacePMACId: this.pmacWorkspace.pmacID,
    }

    const pmacResource = this.pmacWorkspace.environments?.find(c => c.pmUID === this.pmEnvironmentUid)

    console.log(pmacResource)
    if (pmacResource) {
      // Check if resource already exists in pmac
      const existingWrid = await this.fsWorkspaceResourceManager.getPMACWridWithoutName({
        pmacID: pmacResource.pmacID,
        type: WorkspaceResource.Environment,
        workspaceName: this.pmacWorkspace.name,
        workspaceType: this.pmacWorkspace.type,
        workspacePMACId: this.pmacWorkspace.pmacID,
      })

      // if it does, removed it and keep pmacID
      if (existingWrid) {
        // keep the same pmacID
        wrid.pmacID = existingWrid.pmacID
        await this.fsWorkspaceResourceManager.deletePMACWorkspaceResourceFile(existingWrid)
      }
    }

    await this.fsWorkspaceResourceManager.writeWorkspaceResourceDataJson(wrid, pmEnvironment)

    return pmEnvironment
  }
}
