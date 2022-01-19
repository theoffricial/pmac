import PostmanAPIUrls from '../urls'
import PmacAxiosInstance, { PmacAxiosResponse } from '../axios-instance'
import { AxiosRequestConfig } from 'axios'
import {
  PostmanMock,
} from '../types'

export class PostmanMocksAPI {
  constructor(
    private pmacAxiosInstance: typeof PmacAxiosInstance,
    private mocksAPIUrls: typeof PostmanAPIUrls.mocks,
  ) {}

  allMocks(config?: AxiosRequestConfig<any>): Promise<
   PmacAxiosResponse<{
      mocks: PostmanMock[];
    }>
  > {
    return this.pmacAxiosInstance.get<{
      mocks: PostmanMock[];
    }>(this.mocksAPIUrls.allMocks, config)
  }

  singleMock(mockUid: string, config?: AxiosRequestConfig<any>) {
    return this.pmacAxiosInstance.get<{
      mock: PostmanMock;
    }>(this.mocksAPIUrls.singleMock(mockUid), config)
  }
}
