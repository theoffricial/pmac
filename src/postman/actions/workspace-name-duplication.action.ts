import { Inquirer } from 'inquirer'
import { PostmanAPI } from '../api'
import {
  WorkspaceType,
} from '../api/types/workspace.types'
import { PmacConfigurationManager } from '../../file-system'
import { IPmacAction } from './action.interface'

export class WorkspaceNameDuplicationAction implements IPmacAction<boolean> {
  constructor(
    private readonly inquirer: Inquirer,
    private readonly postmanApi: PostmanAPI,
    private readonly config: PmacConfigurationManager,
    private readonly workspace: { name: string, type?: WorkspaceType },
  ) {}

  async run(): Promise<{
    detectDuplication: boolean;
    userDecidedToRename: boolean;
  }> {
    const { workspacesPaths } = await this.config.getWorkspacesPathsByName(
      this.workspace.name,
      this.workspace.type,
      { nocase: true },
    )

    // When no existing collection found
    if (!workspacesPaths || workspacesPaths.length === 0) {
      return { detectDuplication: false, userDecidedToRename: false }
    }

    const duplicationDisplay = ['\n[\n\t'
    .concat(
      workspacesPaths
      .map((workspacePath: string) => {
        const parts = workspacePath.split('/')
        const workspaceName = parts[parts.length - 1]
        return `${this.workspace.type}/${workspaceName}`
      })
      .join(', \n\t'),
    ), '\n]']

    const { userAskedToRename } = await this.inquirer.prompt({
      type: 'confirm',
      message: `Name duplication detected with existing workspaces: ${duplicationDisplay}. \nWould you like would you like to choose a different name?`,
      name: 'userAskedToRename',
    })

    if (userAskedToRename) {
      return { detectDuplication: true, userDecidedToRename: true }
    }

    return { detectDuplication: true, userDecidedToRename: false }
  }
}
