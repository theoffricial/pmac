import { PostmanEnvironment } from '../api/types'
import { PostmanWorkspace } from '../api/types/workspace.types'
import { PostmanCollectionMetadata } from '../api/wrappers/collections.api'
import { IPmacAction } from './action.interface'

export class EnvironmentGetMetadataAction
implements IPmacAction<PostmanCollectionMetadata> {
  constructor(
    private readonly workspace: PostmanWorkspace,
    private readonly environment: PostmanEnvironment,
  ) {}

  async run() {
    const environmentMetadata = this.workspace.environments.find(
      c => c.id === this.environment.id,
    ) as PostmanCollectionMetadata

    return { environmentMetadata }
  }
}
