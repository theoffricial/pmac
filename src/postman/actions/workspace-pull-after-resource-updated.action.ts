import { IPmacAction } from './action.interface'
import { PostmanAPI } from '../api'
import {PmacConfigurationManager } from '../../file-system'
import { PostmanWorkspace } from '../api/types/workspace.types'

/** Updates workspace after resource update */
export class WorkspacePullAfterResourceUpdatedAction
implements IPmacAction<PostmanWorkspace> {
  constructor(
    private readonly config:PmacConfigurationManager,
    private readonly postmanApi: PostmanAPI,
    private readonly workspaceId: string,
  ) {}

  async run() {
    const {
      data: { workspace },
    } = await this.postmanApi.workspaces.getWorkspaceData(this.workspaceId)

    // 1. rename file
    // 2. overwrite 'workspace.json'
    // 3.
    // this.config.renameWorkspaceDir(workspace);
    this.config.writeWorkspaceData(workspace)

    // writing updated env

    return { workspace }
  }
}
