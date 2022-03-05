import { Command } from '@oclif/core'

import inquirer from 'inquirer'
import { postmanApiInstance } from '../../postman/api'
import { PMCollectionFetchAllAction, PMCollectionMetadataChooseAction, CollectionPullAction, PMACWorkspaceChooseAction, PMACWorkspaceGetAllAction } from '../../postman/actions'
import { fsWorkspaceManager, fsWorkspaceResourceManager } from '../../file-system'

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

    const pmacWorkspaces = await new PMACWorkspaceGetAllAction(
      fsWorkspaceManager,
    ).run()

    const pmacWorkspace = await new PMACWorkspaceChooseAction(
      inquirer,
      pmacWorkspaces,
    ).run()

    const pmCollectionsMetadata = await new PMCollectionFetchAllAction(
      postmanApiInstance,
      pmacWorkspace,
    ).run()

    const pmCollectionMetadata = await new PMCollectionMetadataChooseAction(
      inquirer,
      pmCollectionsMetadata,
    ).run()

    await new CollectionPullAction(
      fsWorkspaceResourceManager,
      postmanApiInstance,
      pmacWorkspace,
      pmCollectionMetadata.uid,
    ).run()
    this.log(
      `Collection ${pmCollectionMetadata.name} from Postman pulled into pmac.`,
    )
  }
}
