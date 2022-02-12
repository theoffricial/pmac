import { Command } from '@oclif/core'

import { PmacConfigurationManager } from '../../file-system'
import inquirer from 'inquirer'
import { postmanApiInstance } from '../../postman/api'
import { CollectionFetchAllAction, CollectionMetadataChooseAction, CollectionPullAction, WorkspaceChooseAction, WorkspaceGetAllLocalAction } from '../../postman/actions'

export default class CollectionPull extends Command {
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
    await this.parse(CollectionPull)

    const config = new PmacConfigurationManager()

    const { localWorkspaces } = await new WorkspaceGetAllLocalAction(
      config,
    ).run()

    const { chosenWorkspace } = await new WorkspaceChooseAction(
      inquirer,
      localWorkspaces,
    ).run()

    const { collectionsMetadata } = await new CollectionFetchAllAction(
      postmanApiInstance,
      chosenWorkspace,
    ).run()

    const { chosenCollection } = await new CollectionMetadataChooseAction(
      inquirer,
      collectionsMetadata,
    ).run()

    await new CollectionPullAction(
      config,
      postmanApiInstance,
      chosenWorkspace,
      chosenCollection.uid,
    ).run()

    const pmacName = config.resourceNameConvention(chosenCollection.name, chosenCollection.uid)
    this.log(
      `Collection ${pmacName} pulled into repository.`,
    )
  }
}
