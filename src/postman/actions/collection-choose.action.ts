import { Inquirer } from 'inquirer'
import pad from 'pad'
import { PostmanCollection } from '../api/types/collection.types'
import { IPMACAction, IPmacAction } from './action.interface'

export class CollectionChooseAction implements IPMACAction<PostmanCollection> {
  constructor(
    private readonly _inquirer: Inquirer,
    private readonly pmCollections: PostmanCollection[],
    private readonly options: { customMessage?: string } = {},
  ) {}

  async run() {
    if (!Array.isArray(this.pmCollections)) {
      throw new TypeError(CollectionChooseAction.name + ' invalid options passed.')
    } else if (this.pmCollections.length === 0) {
      throw new Error(CollectionChooseAction.name + ' no collections found.')
    }

    // When array is empty do nothing
    const choices = this.pmCollections.map(collection => ({
      key: `${pad(collection.info.name, 30)}`,
      name: `${pad(collection.info.name, 30)}`,
      value: collection,
    }))

    const answer: { collection: PostmanCollection } =
      await this._inquirer.prompt({
        message: this.options?.customMessage || 'Choose collection',
        type: 'list',
        choices: choices.sort((a, b) => (a.name > b.name ? -1 : 1)),
        name: 'collection',
      })

    return answer.collection
  }
}
