import PostmanAPIUrls from '../urls'
import PmacAxiosInstance, { PmacAxiosResponse } from '../axios-instance'
import { AxiosRequestConfig } from 'axios'
import {
  PostmanEnvironment,
  PostmanEnvironmentMetadata,
  PostmanEnvironmentMinMetadata,
} from '../types'

export class PostmanEnvironmentsAPI {
  constructor(
    private pmacAxiosInstance: typeof PmacAxiosInstance,
    private environmentsAPIUrls: typeof PostmanAPIUrls.environments,
  ) {}

  getAllEnvironments(config?: AxiosRequestConfig<any>): Promise<
   PmacAxiosResponse<{
      environments: PostmanEnvironmentMetadata[];
    }>
  > {
    return this.pmacAxiosInstance.get<{
      environments: PostmanEnvironmentMetadata[];
    }>(this.environmentsAPIUrls.allEnvironments, config)
  }

  getEnvironment(environmentUid: string, config?: AxiosRequestConfig<any>) {
    return this.pmacAxiosInstance.get<{
      environment: PostmanEnvironment;
    }>(this.environmentsAPIUrls.singleEnvironment(environmentUid), config)
  }

  createEnvironment(
    workspaceId: string,
    environment: Pick<PostmanEnvironment, 'name' | 'values'>,
    config?: AxiosRequestConfig<any>,
  ) {
    return this.pmacAxiosInstance.post<{
      environment: PostmanEnvironmentMetadata;
    }>(
      `${this.environmentsAPIUrls.createEnvironment}?workspace=${workspaceId}`,
      { environment },
      config,
    )
  }

  updateEnvironment(
    environmentUid: string,
    update: Pick<PostmanEnvironment, 'name' | 'values'>,
    config?: AxiosRequestConfig<any>,
  ) {
    return this.pmacAxiosInstance.put<{
      environmentMinMetadata: PostmanEnvironmentMinMetadata;
    }>(
      this.environmentsAPIUrls.updateEnvironment(environmentUid),
      { environment: update },
      config,
    )
  }

  deleteEnvironment(environmentUid: string, config?: AxiosRequestConfig<any>) {
    return this.pmacAxiosInstance.delete<{
      environment: { uid: string; id: string };
    }>(this.environmentsAPIUrls.deleteEnvironment(environmentUid), config)
  }
}
