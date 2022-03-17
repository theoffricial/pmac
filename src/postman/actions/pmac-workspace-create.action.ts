import { IPMACAction } from './action.interface'
import { PMACMap, TfsWorkspaceManager } from '../../file-system'
import { WorkspaceType } from '../api/types/workspace.types'
import { Inquirer } from 'inquirer'
import { PMACWorkspace } from '../../file-system/types'

export class PMACWorkspaceCreateAction implements IPMACAction<PMACWorkspace> {
  constructor(
    private readonly fsWorkspaceManager: TfsWorkspaceManager,
    private readonly inquirer: Inquirer,
  ) {}

  async run() {
    const userInputs: { name: string, type: WorkspaceType, description: string } = await this.inquirer.prompt([
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

    const { description: userDescriptionInput } = await this.inquirer.prompt({
      type: 'input',
      message: 'Add description to the workspace [optional]',
      name: 'description',
    })

    const newPMACWorkspace: PMACWorkspace = {
      pmacID: PMACMap.generatePMACuuid(),
      pmID: '',
      pmUID: '',
      description: userDescriptionInput,
      name: userInputs.name,
      type: userInputs.type,
      collections: [],
      environments: [],
      mocks: [],
      monitors: [],
    }

    await this.fsWorkspaceManager.createPMACWorkspaceDir(newPMACWorkspace)

    await this.fsWorkspaceManager.writeWorkspaceDataJson(newPMACWorkspace)

    // const pmWorkspace = await new PMWorkspaceFetchAction(this.postmanApi, workspace.id).run()

    // const pmacWorkspace = await new PMWorkspacePullToPMACAction(
    //   this.fsWorkspaceManager,
    //   this.fsWorkspaceResourceManager,
    //   this.postmanApi,
    //   pmWorkspace,
    // ).run()

    return newPMACWorkspace
  }
}
