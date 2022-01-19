import {
  PostmanWorkspaceMetadata,
} from '../api/types/workspace.types'
import { PmacConfigurationManager } from '../../file-system'
import { IPmacAction } from './action.interface'

export class WorkspaceDeleteLocalAction
implements IPmacAction<PostmanWorkspaceMetadata> {
  constructor(
    private config:PmacConfigurationManager,
    private readonly workspace: PostmanWorkspaceMetadata,
  ) {}

  async run() {
    const { deletedWorkspace } = this.config.deleteWorkspace(this.workspace)
    return { deletedWorkspace }
  }
}
