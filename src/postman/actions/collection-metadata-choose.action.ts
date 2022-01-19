import { Inquirer } from 'inquirer'
import pad from 'pad'
import { PostmanCollectionMetadata } from '../api/wrappers/collections.api'
import { IPmacAction } from './action.interface'

export class CollectionMetadataChooseAction
implements IPmacAction<PostmanCollectionMetadata> {
  constructor(
    private readonly _inquirer: Inquirer,
    private readonly collections: PostmanCollectionMetadata[],
  ) {}

  async run() {
    // When array is empty do nothing
    const choices = this.collections.map(collection => ({
      key: `${pad(collection.name, 30)}`,
      name: `${pad(collection.name, 30)} [${collection.id}]`,
      value: collection,
    }))

    const answer: { collection: PostmanCollectionMetadata } =
      await this._inquirer.prompt({
        message: 'Choose collection',
        type: 'list',
        choices: choices.sort((a, b) => (a.name > b.name ? -1 : 1)),
        name: 'collection',
      })

    return { chosenCollection: answer.collection }
  }
}
