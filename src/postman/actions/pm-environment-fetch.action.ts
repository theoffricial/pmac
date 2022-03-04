import { PostmanEnvironment } from '../api/types'
import { IPMACAction } from './action.interface'
import { PostmanAPI } from '../api'

export class PMEnvironmentFetchAction implements IPMACAction<PostmanEnvironment> {
  constructor(
    private readonly postmanApi: PostmanAPI,
    private readonly pmEnvironmentUid: string,
  ) {}

  async run() {
    try {
      const {
        data: { environment: pmEnvironment },
      } = await this.postmanApi.environments.getEnvironment(this.pmEnvironmentUid)

      return pmEnvironment
    } catch (error) {
    // add logger?
      console.error(error)
      throw new Error(`Error while fetching environment ${this.pmEnvironmentUid} from Postman.`)
    }
  }
}
