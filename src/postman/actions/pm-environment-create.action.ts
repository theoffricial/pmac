import { PostmanEnvironment, PostmanEnvironmentMetadata, WorkspaceResource } from '../api/types'
import { IPMACAction } from './action.interface'
import { PostmanAPI } from '../api'
import { TfsWorkspaceManager, TfsWorkspaceResourceManager } from '../../file-system'
import { PMACWorkspace } from '../../file-system/types'
import { PMEnvironmentFetchAction } from '.'

export class PMEnvironmentCreateAction implements IPMACAction<PostmanEnvironmentMetadata> {
  constructor(
    private readonly fsWorkspaceManager: TfsWorkspaceManager,
    private readonly fsWorkspaceResourceManager: TfsWorkspaceResourceManager,
    private readonly postmanApi: PostmanAPI,
    private readonly pmacWorkspace: PMACWorkspace,
    private readonly pmEnvironment: PostmanEnvironment,
  ) {}

  async run() {
    if (!this.pmacWorkspace.pmID) {
      throw new Error('pmac workspace id not found')
    }

    // eslint-disable-next-line no-warning-comments
    // TODO: Add retry or queue mechanisms
    // try {
    const { data: { environment: newPMEnvironment } } = await this.postmanApi.environments.createEnvironment(
      this.pmacWorkspace.pmID,
      {
        name: this.pmEnvironment.name,
        values: this.pmEnvironment.values,
      },
    )

    const pmEnvironment = await new PMEnvironmentFetchAction(this.postmanApi, newPMEnvironment.uid).run()

    const pmacMap = this.pmacWorkspace.environments.find(pmacE =>
      pmacE.pmID === this.pmEnvironment.id ||
      // tmp solution before environment has solid PM id
      pmacE.pmacID === this.pmEnvironment.id)

    if (!pmacMap) {
      throw new Error('pmac collection pmID not found')
    }

    await this.fsWorkspaceResourceManager.writeWorkspaceResourceDataJson({
      name: pmEnvironment.name,
      pmacID: pmacMap.pmacID,
      type: WorkspaceResource.Environment,
      workspaceName: this.pmacWorkspace.name,
      workspaceType: this.pmacWorkspace.type,
      workspacePMACId: this.pmacWorkspace.pmacID,
    }, pmEnvironment)

    // reassign with real PM values
    pmacMap.pmID = newPMEnvironment.id
    pmacMap.pmUID = newPMEnvironment.uid
    this.fsWorkspaceManager.writeWorkspaceDataJson(this.pmacWorkspace)

    return newPMEnvironment

    //   // Update to reset - because environments update only for "initial value" but not for the current one.
    //   const { data: { environment } } = await this.postmanApi.environments.updateEnvironment(
    //     this.pmEnvironmentUid,
    //     {
    //       name: this.pmEnvironment.name,
    //       values: [],
    //     },
    //   )
    // } catch {
    // When updates fails, try to create the environment
    // Manage this error somehow
    // await new PMACEnvironmentCreateAction(
    //   this.fsWorkspaceResourceManager,
    //   this.postmanApi,
    //   this.pmacWorkspace,
    //   {
    //     name: this.pmEnvironment.name,
    //     values: this.pmEnvironment.values,
    //   }).run()
    // }

    // If succeed, request the real update
    // await this.postmanApi.environments.updateEnvironment(
    //   this.pmEnvironmentUid,
    //   {
    //     name: this.pmEnvironment.name,
    //     values: this.pmEnvironment.values,
    //   },
    // )

    // post update
    // const environment = await new PMEnvironmentPullToPMACAction(
    //   this.fsWorkspaceResourceManager,
    //   this.postmanApi,
    //   this.pmacWorkspace,
    //   this.pmEnvironmentUid,
    // ).run()
  }
}
