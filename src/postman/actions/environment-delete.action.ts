import { PostmanAPI } from '../api'
import { PostmanEnvironmentMetadata } from '../api/types'
import { TfsWorkspaceResourceManager } from '../../file-system'
import { IPMACAction } from './action.interface'
import { PMACEnvironmentDeleteAction } from './pmac-environment-delete.action'
import { PMEnvironmentDeleteAction } from './pm-environment-delete.action'
import { PMACWorkspace } from '../../file-system/types'

export class EnvironmentDeleteAction
implements
  IPMACAction<{
    deletedPMACID: string, deletedPMEnvironmentUid: string, deletedPMEnvironmentId: string;
  }> {
  constructor(
    private readonly fsWorkspaceResourceManager: TfsWorkspaceResourceManager,
    private readonly postmanApi: PostmanAPI,
    private readonly pmacWorkspace: PMACWorkspace,
    private readonly pmEnvironmentMetadata: PostmanEnvironmentMetadata,
  ) {}

  async run() {
    const { deletedPMEnvironmentUid, deletedPMEnvironmentId } = await new PMEnvironmentDeleteAction(
      this.fsWorkspaceResourceManager,
      this.postmanApi,
      this.pmacWorkspace,
      this.pmEnvironmentMetadata,
    ).run()

    const { deletedPMACID } = await new PMACEnvironmentDeleteAction(
      this.fsWorkspaceResourceManager,
      this.pmacWorkspace,
      this.pmEnvironmentMetadata,
    ).run()

    return { deletedPMACID, deletedPMEnvironmentUid, deletedPMEnvironmentId }
  }
}
