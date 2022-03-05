import { PostmanEnvironment, PostmanEnvironmentMinMetadata } from '../api/types'
import { IPMACAction } from './action.interface'
import { PostmanAPI } from '../api'
import { PMACWorkspace } from '../../file-system/types'

export class PMEnvironmentUpdateAction implements IPMACAction<PostmanEnvironmentMinMetadata> {
  constructor(
    private readonly postmanApi: PostmanAPI,
    private readonly pmacWorkspace: PMACWorkspace,
    // private readonly pmEnvironmentUid: string,
    private readonly pmEnvironment: PostmanEnvironment,
  ) {}

  async run() {
    if (!this.pmacWorkspace.pmID) {
      throw new Error('pmac workspace id not found')
    }

    const { data: { environment: resetPMEnvironmentRes } } = await this.postmanApi.environments.updateEnvironment(
      this.pmacWorkspace.pmID,
      {
        name: this.pmEnvironment.name,
        values: [],
      },
    )

    const { data: { environment: newPMEnvironment } } = await this.postmanApi.environments.updateEnvironment(
      this.pmacWorkspace.pmID,
      {
        name: this.pmEnvironment.name,
        values: this.pmEnvironment.values,
      },
    )

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
