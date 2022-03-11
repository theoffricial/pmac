import { PostmanEnvironment, WorkspaceResource } from '../api/types'
import { IPMACAction } from './action.interface'
import { PostmanAPI } from '../api'
import { PMACMap, TfsWorkspaceManager, TfsWorkspaceResourceManager } from '../../file-system'
import { PMACWorkspace } from '../../file-system/types'

export class PMACEnvironmentCreateAction
implements IPMACAction<void> {
  constructor(
    private readonly fsWorkspaceManager: TfsWorkspaceManager,
    private readonly fsWorkspaceResourceManager: TfsWorkspaceResourceManager,
    private readonly pmacWorkspace: PMACWorkspace,
    private readonly newPmEnvironment: Pick<PostmanEnvironment, 'name' | 'values'>,
  ) {}

  async run() {
    if (!this.pmacWorkspace.pmacID) {
      throw new Error('pmac workspace id not found')
    }

    const pmacID = PMACMap.generatePMACuuid()
    const pmIDTmp = PMACMap.generateTemporaryPMACuuid()

    const createdAt = new Date().toISOString()
    await this.fsWorkspaceResourceManager.writeWorkspaceResourceDataJson<WorkspaceResource.Environment>({
      name: this.newPmEnvironment.name,
      type: WorkspaceResource.Environment,
      pmacID,
      pmIDTmp,
      workspaceName: this.pmacWorkspace.name,
      workspacePMACId: this.pmacWorkspace.pmacID,
      workspaceType: this.pmacWorkspace.type,
      pmID: 'not-published-to-pm-yet',
      pmUID: 'not-published-to-pm-yet',
    }, {
      values: this.newPmEnvironment.values,
      name: this.newPmEnvironment.name,
      // tmp - for easy matching before pushing to PM
      id: pmIDTmp,
      createdAt,
      isPublic: false,
      owner: 'pmac-not-published-to-pm-yet',
      updatedAt: createdAt,
    })

    this.pmacWorkspace.environments.push({ pmacID, pmID: '', pmUID: '', pmIDTmp })
    await this.fsWorkspaceManager.writeWorkspaceDataJson(this.pmacWorkspace)
  }
}
