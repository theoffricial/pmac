import { Inquirer } from 'inquirer'
import pad from 'pad'
import { PostmanCollection } from '../api/types/collection.types'
import { IPmacAction } from './action.interface'

export class CollectionChooseAction implements IPmacAction<PostmanCollection> {
  constructor(
    private readonly _inquirer: Inquirer,
    private readonly collections: PostmanCollection[],
    private readonly options: { customMessage?: string } = {},
  ) {}

  async run(): Promise<{ chosenCollection: PostmanCollection; }> {
    if (!Array.isArray(this.collections)) {
      throw new TypeError(CollectionChooseAction.name + ' invalid options passed.')
    } else if (this.collections.length === 0) {
      throw new Error(CollectionChooseAction.name + ' no collections found.')
    }

    // When array is empty do nothing
    const choices = this.collections.map(collection => ({
      key: `${pad(collection.info.name, 30)}`,
      name: `${pad(collection.info.name, 30)} [id:${collection.info._postman_id}]`,
      value: collection,
    }))

    const answer: { collection: PostmanCollection } =
      await this._inquirer.prompt({
        message: this.options?.customMessage || 'Choose collection',
        type: 'list',
        choices: choices.sort((a, b) => (a.name > b.name ? -1 : 1)),
        name: 'collection',
      })

    return { chosenCollection: answer.collection }
  }
}
