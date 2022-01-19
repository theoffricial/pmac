import { Inquirer } from 'inquirer'
import pad from 'pad'
import {
  PostmanWorkspace,
} from '../api/types/workspace.types'
import { IPmacAction } from './action.interface'

export class WorkspaceChooseAction implements IPmacAction<PostmanWorkspace> {
  constructor(
    private readonly inquirer: Inquirer,
    private readonly postmanWorkspaces: PostmanWorkspace[], // private readonly postmanRemoteWorkspaces?: PostmanWorkspace[],
    private readonly options: { message?: string } = {},
  ) {}

  async run(): Promise<{ chosenWorkspace: PostmanWorkspace }> {
    if (!Array.isArray(this.postmanWorkspaces) || this.postmanWorkspaces.length === 0) {
      throw new Error(WorkspaceChooseAction.name + ' invalid options passed.')
    } else if (this.postmanWorkspaces.length === 1) {
      return { chosenWorkspace: this.postmanWorkspaces[0] }
    }

    // When array is empty do nothing
    const choices = this.postmanWorkspaces
    .sort((a, b) => (a.type > b.type ? -1 : 1))
    .map(w => ({
      key: `${pad(w.name, 30)} [${w.type}]`,
      name: `${pad(w.name, 30)} [${w.type}]`,
      value: w,
    }))

    const answer: { workspace: PostmanWorkspace } = await this.inquirer.prompt({
      message: this.options?.message || 'Choose workspace',
      type: 'list',
      choices: choices.sort((a, b) => (a.value.type > b.value.type ? -1 : 1)),
      name: 'workspace',
    })

    return { chosenWorkspace: answer.workspace }
  }
}
