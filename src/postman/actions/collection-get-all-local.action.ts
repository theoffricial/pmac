import { IPmacAction } from './action.interface'
import { PostmanWorkspaceMetadata } from '../api/types/workspace.types'
import { PmacConfigurationManager } from '../../file-system'
import { PostmanCollection } from '../api/types/collection.types'

export class CollectionGetAllLocalAction
implements IPmacAction<PostmanCollection[]> {
  constructor(
    private readonly config:PmacConfigurationManager,
    private readonly workspaceMetadata: PostmanWorkspaceMetadata,
  ) {}

  async run() {
    const { localCollections } = await this.config.getWorkspaceCollections(
      this.workspaceMetadata,
    )

    return { localCollections }
  }
}
