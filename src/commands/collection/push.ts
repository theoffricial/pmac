import { Command } from '@oclif/core'

import { PmacConfigurationManager } from '../../file-system'
import inquirer from 'inquirer'
import { postmanApiInstance } from '../../postman/api'
import { CollectionChooseAction, CollectionPushAction, WorkspaceChooseAction } from '../../postman/actions'
import { CollectionGetMetadataAction } from '../../postman/actions/collection-get-metadata.action'

export default class CollectionPush extends Command {
  static description = 'Pulls (Fetches) new updates about an existing collection on your .pmac (repository).'

  static examples = [
    `$pmac collection pull
`,
  ]

  static flags = {
    // eslint-disable-next-line no-warning-comments
    // TODO: Make collection flag work.
    // collection: Flags.string({
    //   char: 'c',
    //   description: 'Path to your collection JSON definition.',
    //   helpValue: './path/to/your/collection-definition.json',
    //   required: false,
    // }),
  }

  async run(): Promise<void> {
    await this.parse(CollectionPush)

    const config = new PmacConfigurationManager()
    const { localWorkspaces } = await config.getWorkspaces()

    const { chosenWorkspace } = await new WorkspaceChooseAction(
      inquirer,
      localWorkspaces,
    ).run()

    const { localCollections } = await config.getWorkspaceCollections(
      chosenWorkspace,
    )

    if (localCollections.length === 0) {
      this.error('No collections found', {
        exit: 1,
        message: 'No .pmac collections found.',
        suggestions: ['Try to pull workspace, e.g.pmac workspace pull'],
      })
    }

    const { chosenCollection } = await new CollectionChooseAction(
      inquirer,
      localCollections,
    ).run()

    const { collectionMetadata } = await new CollectionGetMetadataAction(chosenWorkspace, chosenCollection).run()

    if (!chosenCollection) {
      this.error('Collection not found', { exit: 1, message: 'Chosen collection has an issue.', code: 'invalid choose' })
    }

    await new CollectionPushAction(
      config,
      postmanApiInstance,
      chosenWorkspace,
      collectionMetadata.uid,
      chosenCollection,
    ).run()

    this.log(`Collection '${collectionMetadata.uid}' updated`)
  }
}
