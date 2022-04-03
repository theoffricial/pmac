import { PostmanAPI } from '../api'
import { PostmanWorkspace } from '../api/types/workspace.types'
import { PMACMap, TfsWorkspaceManager, TfsWorkspaceResourceManager } from '../../file-system'
import { IPMACAction } from './action.interface'
import { CollectionPullAction } from './pm-collection-pull-to-pmac.action'
import { PMEnvironmentPullToPMACAction } from './pm-environment-pull-to-pmac.action'
import { PMACWorkspace } from '../../file-system/types'

export class PMWorkspacePullToPMACAction implements IPMACAction<PMACWorkspace> {
  constructor(
    private readonly fsWorkspaceManager: TfsWorkspaceManager,
    private readonly fsWorkspaceResourceManager: TfsWorkspaceResourceManager,
    private readonly postmanApi: PostmanAPI,
    private readonly pmWorkspace: PostmanWorkspace,
  ) {}

  async run() {
    const currentPmacWorkspace = await this.fsWorkspaceManager.getPMACWorkspaceByPostmanWorkspaceId(this.pmWorkspace.id)
    let pmacWorkspace: PMACWorkspace

    // existing pmac workspace
    if (currentPmacWorkspace) {
      // delete all existsing resources files
      const currCollections = new Map(currentPmacWorkspace.collections?.map(pmacC => ([pmacC.pmUID, pmacC])))
      const currEnvironments = new Map(currentPmacWorkspace.environments?.map(pmacE => ([pmacE.pmUID, pmacE])))

      // It is done in the level of the resources
      // await this.fsWorkspaceResourceManager.deleteAllPMACWorkspaceResources(currentPmacWorkspace)

      pmacWorkspace = {
        pmacID: currentPmacWorkspace.pmacID,
        pmID: currentPmacWorkspace.pmID,
        pmUID: currentPmacWorkspace.pmUID,
        description: this.pmWorkspace.description,
        name: this.pmWorkspace.name,
        type: this.pmWorkspace.type,
        collections: this.pmWorkspace.collections.map(pmC => ({
          pmacID: currCollections.get(pmC.uid)?.pmacID || PMACMap.generatePMACuuid(),
          pmID: pmC.id,
          pmUID: pmC.uid,
        })),
        environments: this.pmWorkspace.environments.map(pmE => ({
          pmacID: currEnvironments.get(pmE.uid)?.pmacID || PMACMap.generatePMACuuid(),
          pmID: pmE.id,
          pmUID: pmE.uid,
        })),
        mocks: [],
        monitors: [],
      }
    } else {
      // new pmac workspace
      pmacWorkspace = {
        pmacID: PMACMap.generatePMACuuid(),
        name: this.pmWorkspace.name,
        description: this.pmWorkspace.description,
        type: this.pmWorkspace.type,
        pmID: this.pmWorkspace.id,
        pmUID: '',
        collections: this.pmWorkspace.collections.map(pmC => ({
          pmacID: PMACMap.generatePMACuuid(),
          pmID: pmC.id,
          pmUID: pmC.uid,
        })) || [],
        environments: this.pmWorkspace.environments.map(pmE => ({
          pmacID: PMACMap.generatePMACuuid(),
          pmID: pmE.id,
          pmUID: pmE.uid,
        })) || [],
        mocks: [],
        monitors: [],
      }
    }

    await this.fsWorkspaceManager.createPMACWorkspaceDir(pmacWorkspace)

    console.log(
      `\n${pmacWorkspace.collections?.length || 0} collections found.\n`,
    )
    console.log('\nPulling collections\n')

    const promises: any[] = []
    // Setup collections
    for (const pmacCollection of pmacWorkspace.collections || []) {
      promises.push(
        new CollectionPullAction(
          this.fsWorkspaceResourceManager,
          this.postmanApi,
          pmacWorkspace,
          pmacCollection.pmUID as string,
        ).run(),
      )
    }

    console.log(
      `\n${this.pmWorkspace.environments?.length || 0} environments found.\n`,
    )
    console.log('\nPulling environments\n')

    // Setup environments
    for (const environmentMetadata of pmacWorkspace.environments || []) {
      promises.push(
        new PMEnvironmentPullToPMACAction(
          this.fsWorkspaceResourceManager,
          this.postmanApi,
          pmacWorkspace,
          environmentMetadata.pmUID as string,
        ).run(),
      )
    }

    // console.log(`\n${this.pmWorkspace.monitors?.length || 0} monitors found.\n`)
    // console.log('\nPulling monitors\n')

    // Setup monitors
    // const AllMonitors = await this.postmanApi.monitors.getAllMonitors()
    // for (const monitor of this.workspace.monitors || []) {
    //   // find each monitor
    //   const selectedMonitor = AllMonitors.data.monitors.find(
    //     m => m.id === this.workspace.monitors[0].id,
    //   )
    //   const {
    //     data: { monitor },
    //   // eslint-disable-next-line no-await-in-loop
    //   } = await this.postmanApi.monitors.getMonitor(
    //     (selectedMonitor as PostmanMonitor).uid,
    //   )

    //   this.config.writeMonitorResource(this.workspace, monitor.uid, monitor)
    // }

    // console.log(`\n${this.workspace.mocks?.length || 0} mocks found.\n`)
    // console.log('\nPulling mocks\n')

    // Setup mocks
    // for (const mockMetadata of this.workspace.mocks || []) {
    //   const {
    //     data: { mock },
    //   // eslint-disable-next-line no-await-in-loop
    //   } = await this.postmanApi.mocks.singleMock(mockMetadata.id)

    //   this.config.writePmacMock(this.workspace, mock.uid, mock)
    // }

    await Promise.all(promises)
    return pmacWorkspace
  }
}
