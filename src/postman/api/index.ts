import PostmanWorkspacesAPI from './wrappers/workspaces.api'
import PmacAxiosInstance from './axios-instance'
import PostmanAPIUrls from './urls'
import { PostmanCollectionsAPI } from './wrappers/collections.api'
import { PostmanEnvironmentsAPI } from './wrappers/environments.api'
import { PostmanMonitorsAPI } from './wrappers/monitors.api'
import { PostmanMocksAPI } from './wrappers/mocks.api'

export class PostmanAPI {
  //   workspaces: PostmanWorkspacesAPI;
  constructor(
    public workspaces: PostmanWorkspacesAPI,
    public collections: PostmanCollectionsAPI,
    public environments: PostmanEnvironmentsAPI,
    public monitors: PostmanMonitorsAPI,
    public mocks: PostmanMocksAPI,
  ) {}
}

const workspacesApi = new PostmanWorkspacesAPI(
  PmacAxiosInstance,
  PostmanAPIUrls.workspaces,
)
export default new PostmanAPI(
  workspacesApi,
  new PostmanCollectionsAPI(PmacAxiosInstance, PostmanAPIUrls.collections),
  new PostmanEnvironmentsAPI(PmacAxiosInstance, PostmanAPIUrls.environments),
  new PostmanMonitorsAPI(PmacAxiosInstance, PostmanAPIUrls.monitors),
  new PostmanMocksAPI(PmacAxiosInstance, PostmanAPIUrls.mocks),
)

export const postmanApiInstance = new PostmanAPI(
  workspacesApi,
  new PostmanCollectionsAPI(PmacAxiosInstance, PostmanAPIUrls.collections),
  new PostmanEnvironmentsAPI(PmacAxiosInstance, PostmanAPIUrls.environments),
  new PostmanMonitorsAPI(PmacAxiosInstance, PostmanAPIUrls.monitors),
  new PostmanMocksAPI(PmacAxiosInstance, PostmanAPIUrls.mocks),
)
