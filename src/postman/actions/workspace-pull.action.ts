import { PostmanAPI } from '../api'
import { PostmanMonitor } from '../api/types'
import { PostmanWorkspace } from '../api/types/workspace.types'
import { PmacConfigurationManager } from '../../file-system'
import { IPmacAction } from './action.interface'
import { CollectionPullAction } from './collection-pull.action'
import { EnvironmentPullAction } from './environment-pull.action'

export class WorkspacePullAction implements IPmacAction<PostmanWorkspace> {
  constructor(
    private readonly config:PmacConfigurationManager,
    private readonly postmanApi: PostmanAPI,
    private readonly workspace: PostmanWorkspace,
  ) {}

  async run() {
    this.config.createWorkspaceDir(this.workspace, { force: true })

    console.log(
      `\n${this.workspace.collections?.length || 0} collections found.\n`,
    )
    console.log('\nPulling collections\n')

    const promises: any[] = []
    // Setup collections
    for (const collectionMetadata of this.workspace.collections || []) {
      promises.push(
        new CollectionPullAction(
          this.config,
          this.postmanApi,
          this.workspace,
          collectionMetadata.uid,
        ).run(),
      )
    }

    console.log(
      `\n${this.workspace.environments?.length || 0} environments found.\n`,
    )
    console.log('\nPulling environments\n')

    // Setup environments
    for (const environmentMetadata of this.workspace.environments || []) {
      promises.push(
        new EnvironmentPullAction(
          this.config,
          this.postmanApi,
          this.workspace,
          environmentMetadata.uid,
        ).run(),
      )
    }

    console.log(`\n${this.workspace.monitors?.length || 0} monitors found.\n`)
    console.log('\nPulling monitors\n')

    // Setup monitors
    const AllMonitors = await this.postmanApi.monitors.getAllMonitors()
    for (const monitor of this.workspace.monitors || []) {
      // find each monitor
      const selectedMonitor = AllMonitors.data.monitors.find(
        m => m.id === this.workspace.monitors[0].id,
      )
      const {
        data: { monitor },
      // eslint-disable-next-line no-await-in-loop
      } = await this.postmanApi.monitors.getMonitor(
        (selectedMonitor as PostmanMonitor).uid,
      )

      this.config.writeMonitorResource(this.workspace, monitor.uid, monitor)
    }

    console.log(`\n${this.workspace.mocks?.length || 0} mocks found.\n`)
    console.log('\nPulling mocks\n')

    // Setup mocks
    for (const mockMetadata of this.workspace.mocks || []) {
      const {
        data: { mock },
      // eslint-disable-next-line no-await-in-loop
      } = await this.postmanApi.mocks.singleMock(mockMetadata.id)

      this.config.writePmacMock(this.workspace, mock.uid, mock)
    }

    const res = await Promise.all(promises)
    return { workspace: this.workspace }
  }
}
