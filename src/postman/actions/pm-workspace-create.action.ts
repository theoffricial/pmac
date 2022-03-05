import { IPMACAction } from './action.interface'
import { PostmanAPI } from '../api'
import { TfsWorkspaceManager, TfsWorkspaceResourceManager } from '../../file-system'
import { WorkspaceType } from '../api/types/workspace.types'
import { PMACWorkspace } from '../../file-system/types'

export class PMWorkspaceCreateAction implements IPMACAction<void> {
  constructor(
    private readonly fsWorkspaceManager: TfsWorkspaceManager,
    private readonly fsWorkspaceResourceManager: TfsWorkspaceResourceManager,
    private readonly postmanApi: PostmanAPI,
    private readonly pmacWorkspace: PMACWorkspace,
  ) {}

  async run() {
    const {
      data: { workspace },
    } = await this.postmanApi.workspaces.createWorkspace({
      name: this.pmacWorkspace.name,
      type: this.pmacWorkspace.type as WorkspaceType,
      description: this.pmacWorkspace.description || '',
      collections: [],
      environments: [],
      mocks: [],
      monitors: [],
    })

    this.pmacWorkspace.pmID = workspace.id

    this.fsWorkspaceManager.writeWorkspaceDataJson(this.pmacWorkspace)

    // const pmWorkspace = await new PMWorkspaceFetchAction(this.postmanApi, workspace.id).run()

    // const pmacWorkspace = await new PMWorkspacePullToPMACAction(
    //   this.fsWorkspaceManager,
    //   this.fsWorkspaceResourceManager,
    //   this.postmanApi,
    //   pmWorkspace,
    // ).run()
  }
}
