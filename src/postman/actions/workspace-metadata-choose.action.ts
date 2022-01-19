import { Inquirer } from 'inquirer'
import pad from 'pad'
import { PostmanWorkspaceMetadata } from '../api/types/workspace.types'
import { IPmacAction } from './action.interface'

export class WorkspaceMetadataChooseAction
implements IPmacAction<PostmanWorkspaceMetadata> {
  constructor(
    private readonly inquirer: Inquirer,
    private readonly postmanWorkspaces: PostmanWorkspaceMetadata[], // private readonly postmanRemoteWorkspaces?: PostmanWorkspace[]
  ) {}

  async run() {
    // When array is empty do nothing
    const choices = this.postmanWorkspaces
    .sort((a, b) => (a.type > b.type ? -1 : 1))
    .map(w => ({
      key: `${pad(w.name, 30)} [${w.type}]`,
      name: `${pad(w.name, 30)} [${w.type}]`,
      value: w,
    }))

    const answer: { workspace: PostmanWorkspaceMetadata } =
      await this.inquirer.prompt({
        message: 'Choose workspace',
        type: 'list',
        choices: choices.sort((a, b) => (a.value.type > b.value.type ? -1 : 1)),
        name: 'workspace',
      })

    return { chosenWorkspaceMetadata: answer.workspace }
  }
}
