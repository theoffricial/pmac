import { Inquirer } from 'inquirer'
import pad from 'pad'
import { PMACWorkspace } from '../../file-system/types'
import { IPMACAction } from './action.interface'

export class PMACWorkspaceChooseAction implements IPMACAction<PMACWorkspace> {
  constructor(
    private readonly inquirer: Inquirer,
    private readonly pmacWorkspaces: PMACWorkspace[], // private readonly postmanRemoteWorkspaces?: PostmanWorkspace[],
    private readonly options: { customMessage?: string } = {},
  ) {}

  async run() {
    if (!Array.isArray(this.pmacWorkspaces)) {
      throw new TypeError(PMACWorkspaceChooseAction.name + ' invalid options passed.')
    } else if (this.pmacWorkspaces.length === 0) {
      throw new Error(PMACWorkspaceChooseAction.name + ' no workspaces found.')
    }

    // When array is empty do nothing
    const choices = this.pmacWorkspaces
    .sort((a, b) => (a.type > b.type ? -1 : 1))
    .map(w => ({
      key: `${pad(w.name, 30)} [${w.type}]`,
      name: `${pad(w.name, 30)} [${w.type}]`,
      value: w,
    }))

    const answer: { workspace: PMACWorkspace } = await this.inquirer.prompt({
      message: this.options?.customMessage || 'Choose workspace',
      type: 'list',
      choices: choices.sort((a, b) => (a.value.type > b.value.type ? -1 : 1)),
      name: 'workspace',
    })

    return answer.workspace
  }
}
