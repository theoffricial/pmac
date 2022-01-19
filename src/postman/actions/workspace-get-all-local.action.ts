import { IPmacAction } from './action.interface'
import { PostmanWorkspace, WorkspaceType } from '../api/types/workspace.types'
import { PmacConfigurationManager } from '../../file-system'

export class WorkspaceGetAllLocalAction
implements IPmacAction<PostmanWorkspace[]> {
  constructor(
    private readonly config:PmacConfigurationManager,
    private readonly type?: WorkspaceType,
  ) {}

  async run() {
    const { localWorkspaces } = await this.config.getWorkspaces(this.type)

    return { localWorkspaces }
  }
}
