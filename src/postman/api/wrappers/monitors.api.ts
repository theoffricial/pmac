import PostmanAPIUrls from '../urls'
import PmacAxiosInstance, { PmacAxiosResponse } from '../axios-instance'
import { AxiosRequestConfig } from 'axios'
import { PostmanMonitor, PostmanMonitorRunResponse } from '../types'

export class PostmanMonitorsAPI {
  constructor(
    private pmacAxiosInstance: typeof PmacAxiosInstance,
    private monitorsAPIUrls: typeof PostmanAPIUrls.monitors,
  ) {}

  getAllMonitors(config?: AxiosRequestConfig<any>): Promise<
   PmacAxiosResponse<{
      monitors: PostmanMonitor[];
    }>
  > {
    return this.pmacAxiosInstance.get<{
      monitors: PostmanMonitor[];
    }>(this.monitorsAPIUrls.allMonitors, config)
  }

  getMonitor(monitorUid: string, config?: AxiosRequestConfig<any>) {
    return this.pmacAxiosInstance.get<{
      monitor: PostmanMonitor;
    }>(this.monitorsAPIUrls.singleMonitor(monitorUid), config)
  }

  runMonitor(monitorUid: string, config?: AxiosRequestConfig<any>) {
    return this.pmacAxiosInstance.post<PostmanMonitorRunResponse>(
      this.monitorsAPIUrls.runMonitor(monitorUid),
      config,
    )
  }
}
