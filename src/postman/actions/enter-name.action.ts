import { Inquirer } from 'inquirer'
import { IPmacAction } from './action.interface'

export class EnterNameAction implements IPmacAction<string> {
  constructor(
    private readonly _inquirer: Inquirer,
    private readonly message: string,
  ) {}

  async run() {
    const { chosenName }: { chosenName: string } = await this._inquirer.prompt({
      message: this.message,
      type: 'input',
      name: 'chosenName',
    })

    return { chosenName }
  }
}
