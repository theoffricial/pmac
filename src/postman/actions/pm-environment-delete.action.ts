import { PostmanAPI } from '../api'
import { PostmanEnvironmentMetadata, WorkspaceResource } from '../api/types'
import { TfsWorkspaceResourceManager } from '../../file-system'
import { IPMACAction } from './action.interface'
// import { WorkspacePullAfterResourceUpdatedAction } from './workspace-pull-after-resource-updated.action'
import { PMACWorkspace } from '../../file-system/types'

export class PMEnvironmentDeleteAction
implements IPMACAction<{ deletedPMEnvironmentUid: string; deletedPMEnvironmentId: string }> {
  constructor(
    private fsWorkspaceResourceManager: TfsWorkspaceResourceManager,
    private postmanApi: PostmanAPI,
    private readonly pmacWorkspace: PMACWorkspace,
    private readonly pmEnvironmentMetadata: PostmanEnvironmentMetadata,
  ) {}

  async run() {
    const pmacMap = this.pmacWorkspace.environments?.find(pmacE => pmacE.pmUID === this.pmEnvironmentMetadata.uid)

    if (!pmacMap) {
      throw new Error(`pm environment uid:${this.pmEnvironmentMetadata.uid} not found in your pmac workspace`)
    }

    const {
      data: { environment },
    } = await this.postmanApi.environments.deleteEnvironment(
      this.pmEnvironmentMetadata.uid,
    )

    this.fsWorkspaceResourceManager.cleanPMIDsFromPMACWorkspaceResourceRecordFromPMACWorkspace({
      name: this.pmEnvironmentMetadata.name,
      pmacID: pmacMap.pmacID,
      type: WorkspaceResource.Environment,
      workspaceName: this.pmacWorkspace.name,
      workspacePMACId: this.pmacWorkspace.pmacID,
      workspaceType: this.pmacWorkspace.type,
    })

    return { deletedPMEnvironmentUid: environment.uid, deletedPMEnvironmentId: environment.id }
  }
}
