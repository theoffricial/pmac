import { ListrTask } from 'listr2'
import { fsWorkspaceManager } from '../../../file-system'
import { PostmanWorkspace } from '../../../postman/api/types'
import { IPmacTaskOptions } from '../../shared/workspace-tasks'
import { fetchWorkspaceResourcesByType } from './fetch-resource-by-type'
import { getPostmanWorkspace } from './get-postman-workspace'
import { IFetchAllTaskCtx, RequiredWorkspaceDataForFetch } from './types'
import { updateOrCreateWrid } from './update-or-create-wrid'
import { updatePmacWorkspace } from './update-pmac-workspace'

export function mainFetchTask(options?: IPmacTaskOptions): ListrTask<IFetchAllTaskCtx>[] {
  return [
    {
      ...options,
      title: options?.title || 'Loading pmac workspaces from pmac files',
      task: async ctx => {
        const { customPmacWorkspaces } = ctx
        ctx.loadedPmacWorkspaces = Array.isArray(customPmacWorkspaces) ?
          customPmacWorkspaces :
          (await fsWorkspaceManager.getAllPMACWorkspaces())
      },
    },
    {
      title: 'Filtering pmac workspaces that are not synced with Postman information yet',
      task: async (ctx, task) => {
        const { loadedPmacWorkspaces } = ctx
        ctx.pmacWorkspaces = loadedPmacWorkspaces
        .filter(w => w.pmID && w.name && w.type && w.pmacID)
        .map(w =>
          ({
            ...w,
            collections: Array.isArray(w.collections) ? w.collections : [],
            environments: Array.isArray(w.environments) ? w.collections : [],
            mocks: Array.isArray(w.mocks) ? w.mocks : [],
            monitors: Array.isArray(w.monitors) ? w.monitors : [],
          } as RequiredWorkspaceDataForFetch),
        )

        const { pmacWorkspaces } = ctx
        if (pmacWorkspaces.length === 0) {
          throw new Error("No pmac workspaces that are in sync with Postman found, consider run 'pmac workspace push'")
        }
      },
    },
    {
      title: 'Preparing data for Postman API requests',
      task: async ctx => {
        if (!Array.isArray(ctx.pmacWorkspaces)) {
          throw new TypeError('Invalid pmac workspaces type')
        } else if (ctx.pmacWorkspaces.length === 0) {
          throw new Error('No pmac workspaces found')
        }

        ctx.pmWorkspaceDataForFetch = ctx.pmacWorkspaces.map(w => ({
          id: w.pmID,
          name: w.name,
          type: w.type,
        }))
      },
    },
    {
      title: 'Fetching Postman workspace/s',
      task: async (ctx, task) => {
        const { pmacWorkspaces } = ctx

        type FetchWorkspaceCtx = {
            postmanWorkspacePromise: Promise<PostmanWorkspace>,
            postmanWorkspace: PostmanWorkspace,
            updatedPmacWorkspace: RequiredWorkspaceDataForFetch
        }
        const subTasks: ListrTask<{ postmanWorkspacePromise: Promise<PostmanWorkspace> }>[] = []
        for (const existingPmacWorkspace of pmacWorkspaces) {
          subTasks.push(
            {
              title: `Fetching Workspace '${existingPmacWorkspace.name}'`,
              task: async (ctx, task) => {
                return task.newListr<FetchWorkspaceCtx>(
                  [
                    {
                      title: `Waiting for workspace '${existingPmacWorkspace.name}' response`,
                      task: async ctx => {
                        const { postmanWorkspacePromise } = ctx
                        ctx.postmanWorkspace = await postmanWorkspacePromise
                      },
                    },
                    {
                      title: 'Merging updates from synced Postman workspace',
                      task: async ctx => {
                        const { postmanWorkspace } = ctx
                        ctx.updatedPmacWorkspace = await updatePmacWorkspace(existingPmacWorkspace, postmanWorkspace)
                        const { updatedPmacWorkspace } = ctx
                        await (existingPmacWorkspace.name === updatedPmacWorkspace.name) ?
                          fsWorkspaceManager.writeWorkspaceDataJson(updatedPmacWorkspace) :
                          fsWorkspaceManager.renamePMACWorkspaceName({
                            name: existingPmacWorkspace.name,
                            type: existingPmacWorkspace.type,
                            pmacID: existingPmacWorkspace.pmacID,
                          }, updatedPmacWorkspace.name)
                      },
                    },
                    {
                      title: `Fetching all workspace '${existingPmacWorkspace.name}' resources`,
                      task: async (ctx, task) => {
                        const { updatedPmacWorkspace } = ctx
                        const [pmCollectionsData, pmEnvironmentsData] = await Promise.all([
                          fetchWorkspaceResourcesByType(updatedPmacWorkspace, 'collections'),
                          fetchWorkspaceResourcesByType(updatedPmacWorkspace, 'environments'),
                        ])

                        return task.newListr(
                          [
                            {
                              title: 'Merging collections updates from Postman',
                              task: async () => {
                                const updateWridsPromises = []
                                for (const resource of pmCollectionsData) {
                                  updateWridsPromises.push(updateOrCreateWrid(updatedPmacWorkspace, resource))
                                }

                                await Promise.all(updateWridsPromises)
                              },
                            },
                            {
                              title: 'Merging environments updates from Postman',
                              task: async () => {
                                const updateWridsPromises = []
                                for (const resource of pmEnvironmentsData) {
                                  updateWridsPromises.push(updateOrCreateWrid(updatedPmacWorkspace, resource))
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
                  ],
                  {
                    ctx: {
                      postmanWorkspacePromise: getPostmanWorkspace(existingPmacWorkspace.pmID),
                    } as any,
                    rendererOptions: {
                      collapse: false,
                    },
                  },
                )
              },
            },
          )
        }

        return task.newListr(subTasks, { rendererOptions: { showTimer: false } })
      },
    },
  ]
}

