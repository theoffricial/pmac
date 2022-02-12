import { Command, Flags } from '@oclif/core'

import { PmacConfigurationManager } from '../../file-system'

import inquirer from 'inquirer'
import { postmanApiInstance } from '../../postman/api'
import { CollectionChooseAction, CollectionGetAllLocalAction, CollectionPushAction, CollectionUpdateFromOA3Action, WorkspaceChooseAction, WorkspaceGetAllLocalAction } from '../../postman/actions'
import { CollectionGetMetadataAction } from '../../postman/actions/collection-get-metadata.action'

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

    const config = new PmacConfigurationManager()

    const { localWorkspaces } = await new WorkspaceGetAllLocalAction(
      config,
    ).run()

    const { chosenWorkspace } = await new WorkspaceChooseAction(
      inquirer,
      localWorkspaces,
    ).run()

    const { localCollections } = await new CollectionGetAllLocalAction(
      config,
      chosenWorkspace,
    ).run()

    const { chosenCollection } = await new CollectionChooseAction(
      inquirer,
      localCollections,
    ).run()

    const { updatedCollection } = await new CollectionUpdateFromOA3Action(
      chosenWorkspace,
      chosenCollection,
      flags['open-api'],
    ).run()

    const { collectionMetadata } = await new CollectionGetMetadataAction(
      chosenWorkspace,
      chosenCollection,
    ).run()

    await new CollectionPushAction(
      config,
      postmanApiInstance,
      chosenWorkspace,
      collectionMetadata.uid,
      updatedCollection,
    ).run()
  }
}
