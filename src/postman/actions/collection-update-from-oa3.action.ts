/* eslint-disable unicorn/no-process-exit */
/* eslint-disable no-process-exit */
import { PostmanCollection } from '../api/types/collection.types'
import { PostmanWorkspace } from '../api/types/workspace.types'
import { getNewCollectionItemsFromOpenAPI } from '../../postman-to-openapi/update-collection/update-collection'
import { convertOA3toPMPromise } from '../../postman-to-openapi'
import { IPmacAction } from './action.interface'
import { CollectionGetMetadataAction } from './collection-get-metadata.action'

export class CollectionUpdateFromOA3Action
implements IPmacAction<PostmanCollection> {
  constructor(
    private readonly workspace: PostmanWorkspace,
    private readonly collection: PostmanCollection,
    private readonly openApiSpecificationPath: string,
  ) {}

  async run(): Promise<{ updatedCollection: PostmanCollection; }> {
    const { collectionMetadata } = await new CollectionGetMetadataAction(
      this.workspace,
      this.collection,
    ).run()

    if (!collectionMetadata) {
      console.error('Collection not found.')
      process.exit(1)
    }

    const postmanCollectionSpecification: PostmanCollection =
      await convertOA3toPMPromise(
        {
          data: this.openApiSpecificationPath,
          type: 'file',
        },
        {},
      )

    const updatedCollectionItems = getNewCollectionItemsFromOpenAPI(
      this.collection.item,
      postmanCollectionSpecification.item,
    )

    const updatedCollection: PostmanCollection = {
      ...postmanCollectionSpecification,
      info: this.collection.info,
      item: updatedCollectionItems,
    }

    return { updatedCollection }
  }
}
