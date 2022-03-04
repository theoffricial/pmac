import { Command, Flags } from '@oclif/core'

import inquirer from 'inquirer'
import { CollectionChooseAction, PMACCollectionGetAllAction, PMACCollectionCalculateUpdatedFromExistingAndOA3Action, PMACWorkspaceChooseAction, PMACWorkspaceGetAllAction } from '../../postman/actions'
import { fsWorkspaceManager, fsWorkspaceResourceManager } from '../../file-system'

export default class CollectionUpdate extends Command {
  static description = `Updates PM collection following changes from your OpenApi V3 (swagger) specification,
Without overwrite defined PM events for the existing items (pre-request scripts, test, etc.).`

  static examples = [
    `$pmac collection update --open-api ./path/to/your/open-api-v3-spec.yml
`,
    `$pmac collection update -o ./path/to/your/open-api-v3-spec.yml
`,
  ]

  static flags = {
    'open-api': Flags.string({
      char: 'o',
      description: 'Path to your OpenApi V3 (known as swagger) specification',
      helpValue: './path/to/your/openapi.yml',
      required: true,
      name: 'openApi',
    }),
    // eslint-disable-next-line no-warning-comments
    // TODO: make overwrite work
    // 'overwrite-events': Flags.boolean({
    //   description: 'Overwrites the existing PM events on the existing items before update, This will give you an updated collection without any defined PM events.',
    //   required: false,
    // }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(CollectionUpdate)

    const pmacWorkspaces = await new PMACWorkspaceGetAllAction(
      fsWorkspaceManager,
    ).run()

    const pmacWorkspace = await new PMACWorkspaceChooseAction(
      inquirer,
      pmacWorkspaces,
    ).run()

    const pmacCollections = await new PMACCollectionGetAllAction(
      fsWorkspaceResourceManager,
      pmacWorkspace,
    ).run()

    const pmacCollection = await new CollectionChooseAction(
      inquirer,
      pmacCollections,
    ).run()

    await new PMACCollectionCalculateUpdatedFromExistingAndOA3Action(
      fsWorkspaceManager,
      fsWorkspaceResourceManager,
      pmacWorkspace,
      pmacCollection,
      flags['open-api'],
    ).run()

    // const { collectionMetadata } = await new PMACCollectionGetPMACMapAction(
    //   chosenWorkspace,
    //   chosenCollection,
    // ).run()

    // await new CollectionPushAction(
    //   config,
    //   postmanApiInstance,
    //   chosenWorkspace,
    //   collectionMetadata.uid,
    //   updatedCollection,
    // ).run()
  }
}
