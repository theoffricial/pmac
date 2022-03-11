import { PostmanAPI } from '../api'
import { PostmanEnvironment, PostmanEnvironmentMetadata, WorkspaceResource } from '../api/types'
import { TfsWorkspaceResourceManager } from '../../file-system'
import { IPMACAction } from './action.interface'
import { PMACEnvironmentDeleteAction } from './pmac-environment-delete.action'
import { PMEnvironmentDeleteAction } from './pm-environment-delete.action'
import { PMACWorkspace } from '../../file-system/types'
import { PMACEnvironmentGetPMACMapAction } from './pmac-environment-get-map.action'

export class EnvironmentDeleteAction
implements
  IPMACAction<void> {
  constructor(
    private readonly fsWorkspaceResourceManager: TfsWorkspaceResourceManager,
    private readonly postmanApi: PostmanAPI,
    private readonly pmacWorkspace: PMACWorkspace,
    private readonly pmacEnvironment: PostmanEnvironment,
  ) {}

  async run() {
    const pmacMap = await new PMACEnvironmentGetPMACMapAction(this.pmacWorkspace, this.pmacEnvironment).run()

    if (!pmacMap) {
      throw new Error(`pmacID not found for the requested ${WorkspaceResource.Environment}`)
    }

    await new PMEnvironmentDeleteAction(
      this.fsWorkspaceResourceManager,
      this.postmanApi,
      this.pmacWorkspace,
      {
        id: pmacMap.pmID || '',
        uid: pmacMap.pmUID || '',
        name: this.pmacEnvironment.name,
        owner: this.pmacEnvironment.owner,
      }).run()

    await new PMACEnvironmentDeleteAction(this.fsWorkspaceResourceManager, {
      name: this.pmacEnvironment.name,
      type: WorkspaceResource.Environment,
      pmacID: pmacMap.pmacID,
      workspaceName: this.pmacWorkspace.name,
      workspaceType: this.pmacWorkspace.type,
      workspacePMACId: this.pmacWorkspace.pmacID,
    }).run()
  }
}
