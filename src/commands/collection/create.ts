import { Command, Flags } from '@oclif/core'
// eslint-disable-next-line unicorn/prefer-node-protocol
import path from 'path'
import inquirer from 'inquirer'

import { convertOA3toPMPromise, getNewCollectionItemsFromOpenAPI } from '../../postman-to-openapi'
import { fsWorkspaceManager, fsWorkspaceResourceManager } from '../../file-system'

import { PMACWorkspaceChooseAction, PMACWorkspaceGetAllAction } from '../../postman/actions'
import { workspacePathValidator } from '../../validators'
import { PMACWorkspace } from '../../file-system/types'
import { PostmanCollection } from '../../postman/api/types'
import { PMACCollectionCreateAction } from '../../postman/actions/pmac-collection-create.action'

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

    const collectionFromOpenApi = await convertOA3toPMPromise(
      {
        data: path.resolve(flags['open-api']),
        type: 'file',
      },
      {},
    )

    let pmacWorkspace: PMACWorkspace
    if (flags.workspace && workspacePathValidator(flags.workspace)) {
      pmacWorkspace = await fsWorkspaceManager.getPMACWorkspaceByPath(flags.workspace)
    } else {
      const pmacWorkspaces = await new PMACWorkspaceGetAllAction(
        fsWorkspaceManager,
      ).run()

      pmacWorkspace = await new PMACWorkspaceChooseAction(
        inquirer,
        pmacWorkspaces,
      ).run()
    }

    if (!flags.workspace) {
      // const { userDecidedToUpdateInstead, duplicateCollections } = await new CollectionHandleDuplicationAction(
      //   flags['open-api'],
      //   inquirer,
      //   postmanApiInstance,
      //   config,
      //   pmacWorkspace,
      //   collectionFromOpenApi.info.name,
      // ).run()

      // if (userDecidedToUpdateInstead) {
      //   this.log('Collection creation terminated, Updates existing instead.')

      //   // Duplicate to collection update, maybe split
      //   const { chosenCollection } = await new CollectionChooseAction(inquirer, duplicateCollections).run()

      //   const { updatedCollection } = await new CollectionCalculateUpdatedFromExistingAndOA3Action(pmacWorkspace, chosenCollection, flags['open-api']).run()
      //   const { collectionMetadata } = await new PMACCollectionGetPMACMapAction(pmacWorkspace, chosenCollection).run()

      //   await new CollectionPushAction(
      //     config,
      //     postmanApiInstance,
      //     pmacWorkspace,
      //     collectionMetadata.uid,
      //     updatedCollection,
      //   ).run()

      //   this.log(`Collection ${config.resourceNameConvention(collectionMetadata.name, collectionMetadata.uid)} updated.`)
      //   this.exit()
      //   return
      // }
    }

    // To process
    const collectionItem = getNewCollectionItemsFromOpenAPI(
      collectionFromOpenApi.item,
      collectionFromOpenApi.item,
    )

    const newPMCollection: PostmanCollection = {
      ...collectionFromOpenApi,
      item: collectionItem,
    }

    try {
      await new PMACCollectionCreateAction(pmacWorkspace, newPMCollection, fsWorkspaceManager, fsWorkspaceResourceManager).run()

      this.log(
        `Collection ${newPMCollection?.info?.name} created successfully!`,
      )
    } catch (error) {
      this.error(error as any)
    }
  }
}
