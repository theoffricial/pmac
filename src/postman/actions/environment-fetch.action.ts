import { PostmanEnvironment } from '../api/types'
import { IPmacAction } from './action.interface'
import { PostmanAPI } from '../api'

export class EnvironmentFetchAction implements IPmacAction<PostmanEnvironment> {
  constructor(
    private readonly postmanApi: PostmanAPI,
    private readonly environmentUid: string,
  ) {}

  async run() {
    const {
      data: { environment },
    } = await this.postmanApi.environments.getEnvironment(this.environmentUid)

    return { environment }
  }
}
