import { Command, Flags } from '@oclif/core'

import { convertOA3toPMPromise, getNewCollectionItemsFromOpenAPI } from '../../postman-to-openapi'
import { PmacConfigurationManager } from '../../file-system'

// eslint-disable-next-line unicorn/prefer-node-protocol
import path from 'path'
import inquirer from 'inquirer'
import { postmanApiInstance } from '../../postman/api'
import { CollectionChooseAction, CollectionGetMetadataAction, CollectionPushAction, CollectionPushNewAction, CollectionUpdateFromOA3Action, WorkspaceChooseAction, WorkspaceGetAllLocalAction } from '../../postman/actions'
import { CollectionHandleDuplicationAction } from '../../postman/actions/collection-handle-duplication.action'
import { workspacePathValidator } from '../../validators'
import { PostmanWorkspace } from '../../postman/api/types/workspace.types'

export default class CollectionCreate extends Command {
  static description = 'Creates a new PM collection out of your service OpenApi V3 (swagger) specification.'

  static examples = [
    `$ pmac collection create --open-api ./path/to/your/open-api-v3-spec.yml
`,
    `$ pmac collection create -o ./path/to/your/open-api-v3-spec.yml
`,
  ]

  static flags = {
    'open-api': Flags.string({
      char: 'o',
      description: 'Path to your OpenApi V3 (known as swagger) specification',
      helpValue: './path/to/your/openapi.yml',
      required: true,
      name: 'open-api',
    }),
    workspace: Flags.string({
      char: 'w',
      name: 'workspace',
      required: false,
      description: 'Path to the required workspace',
    }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(CollectionCreate)

    const config = new PmacConfigurationManager()

    const collectionFromOpenApi = await convertOA3toPMPromise(
      {
        data: path.resolve(flags['open-api']),
        type: 'file',
      },
      {},
    )

    let workspace: PostmanWorkspace
    if (flags.workspace && workspacePathValidator(flags.workspace)) {
      const selectedWorkspace = config.getWorkspaceByPath(flags.workspace)
      workspace = selectedWorkspace
    } else {
      const { localWorkspaces } = await new WorkspaceGetAllLocalAction(
        config,
      ).run()

      const { chosenWorkspace } = await new WorkspaceChooseAction(
        inquirer,
        localWorkspaces,
      ).run()

      workspace = chosenWorkspace
    }

    if (!flags.workspace) {
      const { userDecidedToUpdateInstead, duplicateCollections } = await new CollectionHandleDuplicationAction(
        flags['open-api'],
        inquirer,
        postmanApiInstance,
        config,
        workspace,
        collectionFromOpenApi.info.name,
      ).run()

      if (userDecidedToUpdateInstead) {
        this.log('Collection creation terminated, Updates existing instead.')

        // Duplicate to collection update, maybe split
        const { chosenCollection } = await new CollectionChooseAction(inquirer, duplicateCollections).run()

        const { updatedCollection } = await new CollectionUpdateFromOA3Action(workspace, chosenCollection, flags['open-api']).run()
        const { collectionMetadata } = await new CollectionGetMetadataAction(workspace, chosenCollection).run()

        await new CollectionPushAction(
          config,
          postmanApiInstance,
          workspace,
          collectionMetadata.uid,
          updatedCollection,
        ).run()

        this.log(`Collection ${config.resourceNameConvention(collectionMetadata.name, collectionMetadata.uid)} updated.`)
        this.exit()
        return
      }
    }

    // To process
    const finalItem = getNewCollectionItemsFromOpenAPI(
      collectionFromOpenApi.item,
      collectionFromOpenApi.item,
    )

    const newCollection = {
      ...collectionFromOpenApi,
      item: finalItem,
    }

    try {
      const { collection } = await new CollectionPushNewAction(
        config,
        postmanApiInstance,
        workspace,
        newCollection,
      ).run()

      this.log(
        `Collection ${collection?.info?.name} created successfully!`,
      )
    } catch (error) {
      this.error(error as any)
    }
  }
}
