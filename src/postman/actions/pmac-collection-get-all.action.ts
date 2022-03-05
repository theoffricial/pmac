import { IPMACAction } from './action.interface'
import { WorkspaceResource } from '../api/types/workspace.types'
import { TfsWorkspaceResourceManager } from '../../file-system'
import { PostmanCollection } from '../api/types/collection.types'
import { PMACWorkspace } from '../../file-system/types'

export class PMACCollectionGetAllAction
implements IPMACAction<PostmanCollection[]> {
  constructor(
    private readonly fsWorkspaceResourceManager: TfsWorkspaceResourceManager,
    private readonly pmacWorkspace: PMACWorkspace,
  ) {}

  async run() {
    const pmacCollections = await this.fsWorkspaceResourceManager.getAllPMACWorkspaceResourcesByPattern(this.pmacWorkspace, WorkspaceResource.Collection, '*')

    return pmacCollections
  }
}
