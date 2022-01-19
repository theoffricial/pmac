import { Inquirer } from 'inquirer'
import pad from 'pad'
import {
  PostmanWorkspace,
} from '../api/types/workspace.types'
import { IPmacAction } from './action.interface'

export class WorkspaceChooseAction implements IPmacAction<PostmanWorkspace> {
  constructor(
    private readonly inquirer: Inquirer,
    private readonly workspaces: PostmanWorkspace[], // private readonly postmanRemoteWorkspaces?: PostmanWorkspace[],
    private readonly options: { customMessage?: string } = {},
  ) {}

  async run(): Promise<{ chosenWorkspace: PostmanWorkspace }> {
    if (!Array.isArray(this.workspaces)) {
      throw new TypeError(WorkspaceChooseAction.name + ' invalid options passed.')
    } else if (this.workspaces.length === 0) {
      throw new Error(WorkspaceChooseAction.name + ' no workspaces found.')
    }

    // When array is empty do nothing
    const choices = this.workspaces
    .sort((a, b) => (a.type > b.type ? -1 : 1))
    .map(w => ({
      key: `${pad(w.name, 30)} [${w.type}]`,
      name: `${pad(w.name, 30)} [${w.type}]`,
      value: w,
    }))

    const answer: { workspace: PostmanWorkspace } = await this.inquirer.prompt({
      message: this.options?.customMessage || 'Choose workspace',
      type: 'list',
      choices: choices.sort((a, b) => (a.value.type > b.value.type ? -1 : 1)),
      name: 'workspace',
    })

    return { chosenWorkspace: answer.workspace }
  }
}
