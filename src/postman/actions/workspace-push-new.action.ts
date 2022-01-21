import { IPmacAction } from './action.interface'
import { PostmanAPI } from '../api'
import { PmacConfigurationManager } from '../../file-system'
import { PostmanWorkspace, WorkspaceType } from '../api/types/workspace.types'
import { Inquirer } from 'inquirer'
import { WorkspacePullAction } from '.'
import { WorkspaceNameDuplicationAction } from './workspace-name-duplication.action'

export class WorkspacePushNewAction implements IPmacAction<PostmanWorkspace> {
  constructor(
    private readonly inquirer: Inquirer,
    private readonly config:PmacConfigurationManager,
    private readonly postmanApi: PostmanAPI,
  ) {}

  async run(): Promise<{ newWorkspace: PostmanWorkspace; }> {
    const newWorkspace: { name: string, type: WorkspaceType, description: string } = await this.inquirer.prompt([
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
    ])

    const { detectDuplication, userDecidedToRename } = await new WorkspaceNameDuplicationAction(
      this.inquirer,
      this.postmanApi,
      this.config,
      { name: newWorkspace.name, type: newWorkspace.type }).run()

    if (detectDuplication && userDecidedToRename) {
      let duplicationCheck = true
      while (duplicationCheck) {
        // eslint-disable-next-line no-await-in-loop
        const { newName } = await this.inquirer.prompt(
          {
            type: 'input',
            message: 'Enter a different name for the new workspace',
            name: 'newName',
          })

        // rename
        newWorkspace.name = newName

        const { detectDuplication, userDecidedToRename } =
            // eslint-disable-next-line no-await-in-loop
            await new WorkspaceNameDuplicationAction(
              this.inquirer,
              this.postmanApi,
              this.config,
              { name: newName, type: newWorkspace.type }).run()

        if (!detectDuplication || !userDecidedToRename) {
          duplicationCheck = false
        }
      }
    }

    const { description: workspaceDescription } = await this.inquirer.prompt({
      type: 'input',
      message: 'Add description to the workspace [optional]',
      name: 'description',
    })

    const {
      data: { workspace },
    } = await this.postmanApi.workspaces.createWorkspace({
      name: newWorkspace.name,
      type: newWorkspace.type as WorkspaceType,
      description: workspaceDescription || '',
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
