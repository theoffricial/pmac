import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { fsPrivateManager } from '../../file-system'

export interface PmacAxiosResponse<TData = unknown, RRequest = any>
  extends AxiosResponse<TData, RRequest> {
  postmanAccountApiRateLimits: {
    rateLimit: number;
    rateLimitRemaining: number;
    rateLimitReset: number;
    rateLimitResetInSeconds: number;
  };
}
class PostmanAPIAxiosInstance implements Partial<AxiosInstance> {
  private axiosInstance: AxiosInstance;
  constructor(config?: AxiosRequestConfig<any>) {
    this.axiosInstance = axios.create(config)
    this.#setPostmanInterceptors()
  }

  request<T = unknown, R =PmacAxiosResponse<T, any>, D = any>(
    _config: AxiosRequestConfig<D>,
  ): Promise<R> {
    throw new Error('Method not implemented.')
  }

  delete<T = unknown, R =PmacAxiosResponse<T, any>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Promise<R> {
    return this.axiosInstance.delete(url, config)
  }

  head<T = unknown, R =PmacAxiosResponse<T, any>, D = any>(
    _url: string,
    _config?: AxiosRequestConfig<D>,
  ): Promise<R> {
    throw new Error('Method not implemented.')
  }

  options<T = unknown, R =PmacAxiosResponse<T, any>, D = any>(
    _url: string,
    _config?: AxiosRequestConfig<D>,
  ): Promise<R> {
    throw new Error('Method not implemented.')
  }

  post<T = unknown, R =PmacAxiosResponse<T, any>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R> {
    return this.axiosInstance.post(url, data, config)
  }

  put<T = unknown, R =PmacAxiosResponse<T, any>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R> {
    return this.axiosInstance.put(url, data, config)
  }

  patch<T = unknown, R =PmacAxiosResponse<T, any>, D = any>(
    _url: string,
    _data?: D,
    _config?: AxiosRequestConfig<D>,
  ): Promise<R> {
    throw new Error('Method not implemented.')
  }

  get<T = unknown, R =PmacAxiosResponse<T, any>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D> | undefined,
  ): Promise<R> {
    return this.axiosInstance.get(url, config)
  }

  async #setPostmanInterceptors() {
    if (!this.axiosInstance) return
    const privateJson = await fsPrivateManager.getPrivateConfig()

    this.axiosInstance.interceptors.request.use(
      config => {
        // Do something before request is sent
        if (config.headers && !config.headers['X-Api-Key']) {
          config.headers = {
            ...config.headers,
            'X-Api-Key': privateJson?.apiKey || '',
          }
        }

        return config
      },
      error => {
        // Do something with request error
        console.error(error)
        return Promise.reject(error)
      },
    )
    this.axiosInstance.interceptors.response.use(
      response => {
        // x-frame-options:'SAMEORIGIN'
        // x-ratelimit-limit:'60'
        // x-ratelimit-remaining:'59'
        // x-ratelimit-reset:'1634904847'
        // x-srv-span:'v=1;s=9c8c0737b9592c68'
        // x-srv-trace:'v=1;t=2e27642d58d46466'
        // const apiRateLimitData = {
        //   accountRateLimit: ,
        //   accountRateLimitRemaining: ,
        //   accountRateLimitReset: response.headers["x-ratelimit-reset"],
        // };
        (response as PmacAxiosResponse).postmanAccountApiRateLimits = {
          rateLimit: Number(response.headers['x-ratelimit-limit']),
          rateLimitRemaining: Number(response.headers['x-ratelimit-remaining']),
          rateLimitReset: Number(response.headers['x-ratelimit-reset']),
          rateLimitResetInSeconds:
            // Divides by 1000 to ignore ms and reduce time till next rest
            Number(response.headers['x-ratelimit-reset']) - (Date.now() / 1000),
        }
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response as PmacAxiosResponse
      },
      (axiosError: AxiosError)  => {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        console.error(axiosError?.response?.data)
        return Promise.reject(axiosError)
      },
    )
  }
}

export default new PostmanAPIAxiosInstance()
