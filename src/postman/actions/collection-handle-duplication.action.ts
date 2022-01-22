import { Inquirer } from 'inquirer'
import { CollectionChooseAction, CollectionPushAction } from '.'
import { PostmanAPI } from '../api'
import {
  PostmanWorkspace, WorkspaceResource,
} from '../api/types/workspace.types'
import { PmacConfigurationManager } from '../../file-system'
import { IPmacAction } from './action.interface'
import { CollectionGetMetadataAction } from './collection-get-metadata.action'
import { CollectionUpdateFromOA3Action } from './collection-update-from-oa3.action'
import { PostmanCollection } from '../api/types/collection.types'

export class CollectionHandleDuplicationAction implements IPmacAction<boolean | PostmanCollection[]> {
  constructor(
    private readonly openApiSpecPath: string,
    private readonly inquirer: Inquirer,
    private readonly postmanApi: PostmanAPI,
    private readonly config:PmacConfigurationManager,
    private readonly workspace: PostmanWorkspace,
    private readonly collectionName: string,
  ) {}

  async run(): Promise<{
    detectDuplication: boolean;
    userDecidedToUpdateInstead: boolean;
    duplicateCollections: PostmanCollection[];
  }> {
    const matches = await this.config.getWorkspaceResourcesPaths(
      this.workspace,
      this.config.allResourcesByNamePattern(WorkspaceResource.Collection, this.collectionName),
      { nocase: true },
    )

    // When no existing collection found
    if (!matches || matches.length === 0) {
      return { detectDuplication: false, userDecidedToUpdateInstead: false, duplicateCollections: [] }
    }

    const duplicationDisplay = ['\n[\n\t'
    .concat(
      matches
      .map((m: string) => m.split('/').pop()?.split('.').shift())
      .join(', \n\t'),
    ), '\n]']
    const { userAskedToUpdate } = await this.inquirer.prompt({
      type: 'confirm',
      message: `pmac detect duplication with existing collections: ${duplicationDisplay}. \nWould you like to stop the creation of the new collection, \nand update one of the detected collection instead?`,
      name: 'userAskedToUpdate',
    })

    const duplicateCollections = this.config.getCollectionsByPaths(matches)

    if (!userAskedToUpdate) {
      return { detectDuplication: true, userDecidedToUpdateInstead: false, duplicateCollections }
    }

    const { chosenCollection } = await new CollectionChooseAction(
      this.inquirer,
      duplicateCollections,
    ).run()

    const { collectionMetadata } = await new CollectionGetMetadataAction(
      this.workspace,
      chosenCollection,
    ).run()

    const { updatedCollection } = await new CollectionUpdateFromOA3Action(
      this.workspace,
      chosenCollection,
      this.openApiSpecPath,
    ).run()

    const { collection } = await new CollectionPushAction(
      this.config,
      this.postmanApi,
      this.workspace,
      collectionMetadata.uid,
      updatedCollection,
    ).run()

    return { detectDuplication: true, userDecidedToUpdateInstead: true, duplicateCollections }
  }
}
