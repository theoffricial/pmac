import { Command, Flags } from '@oclif/core'

import { postmanApiInstance } from '../../postman/api'
import { fsWorkspaceManager, PMACMap } from '../../file-system'
import { PostmanWorkspace, PostmanWorkspaceMetadata, WorkspaceTypeValues } from '../../postman/api/types'
import { Listr } from 'listr2'
import { choosePostmanWorkspaceMetaTask } from '../../commands-helpers/shared/workspace-tasks/choose-workspace.task'
import { getPostmanWorkspace } from '../../commands-helpers/workspace/fetch.helper/get-postman-workspace'
import { PMACWorkspace } from '../../file-system/types'
import { fetchWorkspaceResourcesByType } from '../../commands-helpers/workspace/fetch.helper/fetch-resource-by-type'
import { RequiredWorkspaceDataForFetch } from '../../commands-helpers/workspace/fetch.helper/types'
import { updateOrCreateWrid } from '../../commands-helpers/workspace/fetch.helper/update-or-create-wrid'

export default class WorkspaceSync extends Command {
  static description = 'Syncs one of your Postman workspaces that is not in synced with pmac yet into pmac'

  static examples = [
    'pmac workspace sync',
  ]

  static flags = {
    id: Flags.string({ description: 'workspace id', required: false, helpValue: '<workspace specific id>' }),
    name: Flags.string({ char: 'n', description: 'The exact name of your workspace, on name duplication will pick first match.', required: false, helpValue: '<workspace name>' }),
    type: Flags.enum({ description: 'A specific workspace type, useful in case of duplicate names', required: false, options: WorkspaceTypeValues, helpValue: `<workspace-type: ${WorkspaceTypeValues.join(' | ')}>` }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(WorkspaceSync)

    const fetchPmWorkspacesTask = new Listr<{ postmanWorkspacesMeta: PostmanWorkspaceMetadata[] }>({
      title: 'Fetching Postman workspace',
      task: async (ctx, task) => {
        ctx.postmanWorkspacesMeta = await getAllPostmanWorkspaces()
      },
    })

    const { postmanWorkspacesMeta } = await fetchPmWorkspacesTask.run()

    const mapd = new Map(postmanWorkspacesMeta.map(w => ([w.id, w])))
    const pmacWorkspaces = await fsWorkspaceManager.getAllPMACWorkspaces()
    for (const pmW of pmacWorkspaces) {
      mapd.delete(pmW.pmID || '')
    }

    const unSyncedPmWorkspaces = [...mapd.values()]

    const selectedWorkspaceMetaTask = new Listr(
      choosePostmanWorkspaceMetaTask(unSyncedPmWorkspaces),
    )

    const { chosenWorkspace: selectedWorkspaceMeta } = await selectedWorkspaceMetaTask.run()

    await new Listr([
      {
        title: `Syncing Postman workspace '${selectedWorkspaceMeta.name}' with pmac`,
        task: async (ctx, task) => task.newListr<{ postmanWorkspace: PostmanWorkspace, newPmacWorkspace: PMACWorkspace }>([
          {
            title: `Fetching workspace '${selectedWorkspaceMeta.name}' full data from Postman API`,
            task: async (ctx, task) => {
              ctx.postmanWorkspace = await getPostmanWorkspace(selectedWorkspaceMeta.id)
            },
          },
          {
            title: 'Normalize Postman workspace data to pmac',
            task: async (ctx, task) => {
              const { postmanWorkspace } = ctx
              ctx.newPmacWorkspace = {
                pmacID: PMACMap.generatePMACuuid(),
                name: postmanWorkspace.name,
                type: postmanWorkspace.type,
                description: postmanWorkspace.description,
                pmID: postmanWorkspace.id,
                pmUID: '',
                collections: postmanWorkspace.collections?.map(postmanCollectionMetadata => ({
                  pmacID: PMACMap.generatePMACuuid(),
                  pmID: postmanCollectionMetadata.id,
                  pmUID: postmanCollectionMetadata.uid,
                })) || [],
                environments: postmanWorkspace.environments?.map(postmanEnvironmentMetadata => ({
                  pmacID: PMACMap.generatePMACuuid(),
                  pmID: postmanEnvironmentMetadata.id,
                  pmUID: postmanEnvironmentMetadata.uid,
                })) || [],
                mocks: [],
                monitors: [],
              }

              const { newPmacWorkspace } = ctx
              await fsWorkspaceManager.createPMACWorkspaceDir(newPmacWorkspace)
              await fsWorkspaceManager.writeWorkspaceDataJson(newPmacWorkspace)
            },
          },
          {
            title: `Fetching all workspace '${selectedWorkspaceMeta.name}' resources`,
            task: async (ctx, task) => {
              const { newPmacWorkspace } = ctx
              const [pmCollectionsData, pmEnvironmentsData] = await Promise.all([
                fetchWorkspaceResourcesByType(newPmacWorkspace as RequiredWorkspaceDataForFetch, 'collections'),
                fetchWorkspaceResourcesByType(newPmacWorkspace as RequiredWorkspaceDataForFetch, 'environments'),
              ])

              return task.newListr(
                [
                  {
                    title: 'Merging collections updates from Postman',
                    task: async () => {
                      const updateWridsPromises = []
                      for (const resource of pmCollectionsData) {
                        updateWridsPromises.push(updateOrCreateWrid(newPmacWorkspace, resource))
                      }

                      await Promise.all(updateWridsPromises)
                    },
                  },
                  {
                    title: 'Merging environments updates from Postman',
                    task: async () => {
                      const updateWridsPromises = []
                      for (const resource of pmEnvironmentsData) {
                        updateWridsPromises.push(updateOrCreateWrid(newPmacWorkspace, resource))
                      }

                      await Promise.all(updateWridsPromises)
                    },
                  },
                ],
                {
                  concurrent: true,
                  rendererOptions: {
                    collapse: false,
                  },
                },
              )
            },
          },
        ]),
      },
    ]).run()
  }
}

async function getAllPostmanWorkspaces() {
  const {
    data,
  } = await postmanApiInstance.workspaces.getAllWorkspacesMetadata()
  return data?.workspaces
}
