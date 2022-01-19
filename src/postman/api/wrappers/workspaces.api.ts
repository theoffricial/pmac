import PostmanAPIUrls from '../urls'
import PmacAxiosInstance, { PmacAxiosResponse } from '../axios-instance'
import { AxiosRequestConfig } from 'axios'
import {
  PostmanWorkspace,
  PostmanWorkspaceMetadata,
} from '../types/workspace.types'

export default class PostmanWorkspacesAPI {
  constructor(
    private pmacAxiosInstance: typeof PmacAxiosInstance,
    private workspacesAPIUrls: typeof PostmanAPIUrls.workspaces,
  ) {}

  /**
   * @param config config
   * @returns
   * @see https://www.postman.com/postman/workspace/postman-public-workspace/documentation/12959542-c8142d51-e97c-46b6-bd77-52bb66712c9a
   */
  getAllWorkspacesMetadata(config?: AxiosRequestConfig<any>): Promise<
   PmacAxiosResponse<{
      workspaces: PostmanWorkspaceMetadata[];
    }>
  > {
    return this.pmacAxiosInstance.get<{
      workspaces: PostmanWorkspaceMetadata[];
    }>(this.workspacesAPIUrls.allWorkspaces, config)
  }

  getWorkspaceData(id: string, config?: AxiosRequestConfig<any>) {
    return this.pmacAxiosInstance.get<{
      workspace: PostmanWorkspace;
    }>(this.workspacesAPIUrls.singleWorkspace(id), config)
  }

  createWorkspace(
    newWorkspace: Omit<PostmanWorkspace, 'id'>,
    config?: AxiosRequestConfig<any>,
  ) {
    return this.pmacAxiosInstance.post<{
      workspace: Pick<PostmanWorkspace, 'name' | 'id'>;
    }>(
      this.workspacesAPIUrls.createWorkspace,
      { workspace: newWorkspace },
      config,
    )
  }

  updateWorkspace(
    id: string,
    update: Partial<PostmanWorkspace>,
    config?: AxiosRequestConfig<any>,
  ) {
    return this.pmacAxiosInstance.put(
      this.workspacesAPIUrls.updateWorkspace(id),
      update,
      config,
    )
  }

  deleteWorkspace(workspaceId: string, config?: AxiosRequestConfig<any>) {
    return this.pmacAxiosInstance.delete<{ workspace: { id: string } }>(
      this.workspacesAPIUrls.deleteWorkspace(workspaceId),
      config,
    )
  }
}
