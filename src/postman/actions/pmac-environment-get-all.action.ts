import { IPMACAction } from './action.interface'
import { WorkspaceResource } from '../api/types/workspace.types'
import { TfsWorkspaceResourceManager } from '../../file-system'
import { PostmanEnvironment } from '../api/types'
import { PMACWorkspaceID } from '../../file-system/types'

export class PMACEnvironmentGetAllAction
implements IPMACAction<PostmanEnvironment[]> {
  constructor(
    private readonly fsWorkspaceResourceManager: TfsWorkspaceResourceManager,
    private readonly wid: PMACWorkspaceID,
  ) {}

  async run() {
    const pmacEnvironments = await this.fsWorkspaceResourceManager.getAllPMACWorkspaceResourcesByPattern<WorkspaceResource.Environment>(this.wid, WorkspaceResource.Environment, '*')

    return pmacEnvironments
  }
}
