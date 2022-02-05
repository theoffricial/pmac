import {
  PostmanCollection,
  PostmanCollectionCreate,
} from '../types/collection.types'
import PostmanAPIUrls from '../urls'
import PmacAxiosInstance, { PmacAxiosResponse } from '../axios-instance'
import { AxiosRequestConfig } from 'axios'

export type PostmanCollectionMetadata = {
  id: string;
  uid: string;
  name: string;
};

export class PostmanCollectionsAPI {
  constructor(
    private pmacAxiosInstance: typeof PmacAxiosInstance,
    private collectionsAPIUrls: typeof PostmanAPIUrls.collections,
  ) {}

  // @see https://www.postman.com/postman/workspace/postman-public-workspace/documentation/12959542-c8142d51-e97c-46b6-bd77-52bb66712c9a
  getAllCollectionsMetadata(config?: AxiosRequestConfig<any>): Promise<
   PmacAxiosResponse<{
      collections: PostmanCollectionMetadata[];
    }>
  > {
    return this.pmacAxiosInstance.get<{
      collections: PostmanCollectionMetadata[];
    }>(this.collectionsAPIUrls.allCollections, config)
  }

  getCollection(uid: string, config?: AxiosRequestConfig<any>): Promise<PmacAxiosResponse<{collection: PostmanCollection; }, any>> {
    return this.pmacAxiosInstance.get<{
      collection: PostmanCollection;
    }>(this.collectionsAPIUrls.singleCollection(uid), config)
  }

  async createCollection(
    workspaceId: string,
    collection: PostmanCollectionCreate,
    config?: AxiosRequestConfig<any>,
  ): Promise<PmacAxiosResponse<{ collection: PostmanCollectionMetadata; }, any>> {
    return this.pmacAxiosInstance.post<{
      collection: PostmanCollectionMetadata;
    }>(
      `${this.collectionsAPIUrls.createCollection}?workspace=${workspaceId}`,
      { collection },
      config,
    )
  }

  async updateCollection(
    collectionUid: string,
    update: Partial<PostmanCollection>,
    config?: AxiosRequestConfig<any>,
  ): Promise<PmacAxiosResponse<{ collection: PostmanCollectionMetadata; }, any>> {
    return this.pmacAxiosInstance.put<{
      collection: PostmanCollectionMetadata;
    }>(
      this.collectionsAPIUrls.updateCollection(collectionUid),
      { collection: update },
      config,
    )
  }

  async deleteCollection(
    collectionUid: string,
    config?: AxiosRequestConfig<any>,
  ): Promise<PmacAxiosResponse<{ collection: PostmanCollectionMetadata; }, any>> {
    return this.pmacAxiosInstance.delete<{
        collection: PostmanCollectionMetadata;
      }>(this.collectionsAPIUrls.deleteCollection(collectionUid), config)
  }
}
