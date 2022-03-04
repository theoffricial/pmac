import { PostmanEnvironment, PostmanEnvironmentMetadata, WorkspaceResource } from '../api/types'
import { IPMACAction } from './action.interface'
import { PostmanAPI } from '../api'
import { PMACMap, TfsWorkspaceManager, TfsWorkspaceResourceManager } from '../../file-system'
import { PMACWorkspace } from '../../file-system/types'

export class PMACEnvironmentCreateAction
implements IPMACAction<void> {
  constructor(
    private readonly fsWorkspaceManager: TfsWorkspaceManager,
    private readonly fsWorkspaceResourceManager: TfsWorkspaceResourceManager,
    private readonly postmanApi: PostmanAPI,
    private readonly pmacWorkspace: PMACWorkspace,
    private readonly newPmEnvironment: Pick<PostmanEnvironment, 'name' | 'values'>,
  ) {}

  async run() {
    if (!this.pmacWorkspace.pmacID) {
      throw new Error('pmac workspace id not found')
    }

    const pmacID = PMACMap.generatePMACuuid()

    await this.fsWorkspaceResourceManager.writeWorkspaceResourceDataJson<WorkspaceResource.Environment>({
      name: this.newPmEnvironment.name,
      type: WorkspaceResource.Environment,
      pmacID,
      workspaceName: this.pmacWorkspace.name,
      workspacePMACId: this.pmacWorkspace.pmacID,
      workspaceType: this.pmacWorkspace.type,
      pmID: '',
      pmUID: '',
    }, {
      values: this.newPmEnvironment.values,
      name: this.newPmEnvironment.name,
      // tmp - for easy matching before pushing to PM
      id: pmacID,
      createdAt: '',
      isPublic: false,
      owner: '',
      updatedAt: '',
    })

    this.pmacWorkspace.environments.push({ pmacID, pmID: '', pmUID: '' })
    await this.fsWorkspaceManager.writeWorkspaceDataJson(this.pmacWorkspace)

    // try {
    //   const {
    //     data: { environment: environmentMetadata },
    //   } = await this.postmanApi.environments.createEnvironment(
    //     this.pmacWorkspace.pmID || '',
    //     {
    //       name: this.newPmEnvironment.name,
    //       values: this.newPmEnvironment.values,
    //     },
    //   )
    //   bla = environmentMetadata
    // } catch (error) {
    //   console.error(error)
    // }

    // // Updating workspace data
    // await new WorkspacePullAfterResourceUpdatedAction(
    //   this.config,
    //   this.postmanApi,
    //   this.pmacWorkspace.id,
    // ).run()

    // Pull collection after updating
    // const pmEnvironment = await new PMEnvironmentPullToPMACAction(
    //   this.fsWorkspaceResourceManager,
    //   this.postmanApi,
    //   this.pmacWorkspace,
    //   bla.uid,
    // ).run()
  }
}
