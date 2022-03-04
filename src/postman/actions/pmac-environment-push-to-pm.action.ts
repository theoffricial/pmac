import { IPMACAction } from './action.interface'
import { PostmanAPI } from '../api'
import { PMACWorkspace } from '../../file-system/types'
import { TfsWorkspaceManager, TfsWorkspaceResourceManager } from '../../file-system'
import { PostmanEnvironment, PostmanEnvironmentMinMetadata } from '../api/types'
import { PMEnvironmentCreateAction, PMEnvironmentUpdateAction } from '.'

export class EnvironmentPushAction implements IPMACAction<PostmanEnvironmentMinMetadata> {
  constructor(
    private readonly fsWorkspaceManager: TfsWorkspaceManager,
    private readonly fsWorkspaceResourceManager: TfsWorkspaceResourceManager,
    private readonly pmApi: PostmanAPI,
    private readonly pmacWorkspace: PMACWorkspace,
    private readonly pmEnvironment: PostmanEnvironment,
  ) {}

  async run() {
    if (!this.pmacWorkspace.pmID) {
      throw new Error(`pmac workspace pmID not found, please push workspace pmac: ${this.pmacWorkspace.pmacID} first.`)
    }

    let pmEnvironmentMetadata: PostmanEnvironmentMinMetadata

    try {
      pmEnvironmentMetadata = await new PMEnvironmentUpdateAction(this.pmApi, this.pmacWorkspace, this.pmEnvironment).run()
    } catch {
      pmEnvironmentMetadata = await new PMEnvironmentCreateAction(
        this.fsWorkspaceManager,
        this.fsWorkspaceResourceManager,
        this.pmApi,
        this.pmacWorkspace,
        this.pmEnvironment,
      ).run().catch(error => {
        throw error
      })
    }

    // const pmacMap = this.pmacWorkspace.collections?.find(pmacC => pmacC.pmUID === pmEnvironmentMetadata.uid)
    // if (!pmacMap) {
    //   throw new Error('pmacMap not found')
    // }

    // pmacMap.pmUID = pmEnvironmentMetadata.uid

    // this.fsWorkspaceManager.writeWorkspaceDataJson(this.pmacWorkspace)

    return pmEnvironmentMetadata
  }
}
