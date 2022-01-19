import { IPmacAction } from './action.interface'
import { PostmanAPI } from '../api'
import {PmacConfigurationManager } from '../../file-system'
import { PostmanWorkspace, WorkspaceType } from '../api/types/workspace.types'
import { Inquirer } from 'inquirer'
import { WorkspacePullAction } from '.'

export class WorkspacePushNewAction implements IPmacAction<PostmanWorkspace> {
  constructor(
    private readonly inquirer: Inquirer,
    private readonly config:PmacConfigurationManager,
    private readonly postmanApi: PostmanAPI,
  ) {}

  async run(): Promise<{ newWorkspace: PostmanWorkspace; }> {
    const newWorkspace = await this.inquirer.prompt([
      {
        type: 'input',
        message: 'Enter a name for the new workspace',
        name: 'name',
      },
      {
        type: 'list',
        message: 'Select workspace type',
        choices: [WorkspaceType.Personal, WorkspaceType.Team],
        name: 'type',
      },
      {
        type: 'input',
        message: 'Add description to the workspace [optional]',
        name: 'description',
      },
    ])

    const {
      data: { workspace },
    } = await this.postmanApi.workspaces.createWorkspace({
      name: newWorkspace.name,
      type: newWorkspace.type as WorkspaceType,
      description: newWorkspace.description || '',
      collections: [],
      environments: [],
      mocks: [],
      monitors: [],
    })

    const {
      data: { workspace: fetchedWorkspace },
    } = await this.postmanApi.workspaces.getWorkspaceData(workspace.id)

    const { workspace: pulledWorkspace } = await new WorkspacePullAction(
      this.config,
      this.postmanApi,
      fetchedWorkspace,
    ).run()

    return { newWorkspace: pulledWorkspace }
  }
}
