import { Inquirer } from 'inquirer'
import pad from 'pad'
import { PostmanEnvironmentMetadata } from '../api/types'
import { IPmacAction } from './action.interface'

export class EnvironmentMetadataChooseAction
implements IPmacAction<PostmanEnvironmentMetadata> {
  constructor(
    private readonly _inquirer: Inquirer,
    private readonly environments: PostmanEnvironmentMetadata[],
  ) {}

  async run() {
    // When array is empty do nothing
    const choices = this.environments.map(env => ({
      key: pad(env.name, 30),
      name: `${pad(env.name, 30)} [${env.id}]`,
      value: env,
    }))

    const answer: { environment: PostmanEnvironmentMetadata } =
      await this._inquirer.prompt({
        message: 'Choose environment',
        type: 'list',
        choices: choices.sort((a, b) => (a.name > b.name ? -1 : 1)),
        name: 'environment',
      })

    return { chosenEnvironment: answer.environment }
  }
}
