import { Command } from '@oclif/core'

import { PMACWorkspaceGetAllAction, PMWorkspaceFetchAction, PMWorkspacePullToPMACAction } from '../../postman/actions'
import { postmanApiInstance } from '../../postman/api'
import { fsWorkspaceManager, fsWorkspaceResourceManager } from '../../file-system'
import { PostmanWorkspace } from '../../postman/api/types'
import { PMACWorkspace } from '../../file-system/types'
import { Listr, ListrTask } from 'listr2'
import { PmacWorkspaceFetchCtx } from '../../commands-helpers/workspace/fetch.helper'
import { workspaceSharedTasks } from '../../commands-helpers/shared/workspace-tasks'

export default class WorkspaceFetch extends Command {
  static description = 'Fetches all pulled workspaces up-to-date.'

  static examples = [
    'pmac workspace fetch',
  ]

  async run(): Promise<void> {
    await this.parse(WorkspaceFetch)

    // const subTasks: ListrTask<PmacWorkspaceFetchCtx>[] = [
    //   workspaceSharedTasks.getAllPmacWorkspacesTask({}),
    // ]

    // const mainTask = new Listr<PmacWorkspaceFetchCtx>({
    //   title: 'Fetching your Postman workspaces to pmac workspaces',
    //   task: async (_ctx, task) => task.newListr(subTasks),
    // },
    // {
    //   ctx: {},
    //   rendererOptions: { showErrorMessage: false, collapse: false, showTimer: true },
    // })

    // const ctx = await mainTask.run()

    const pmacWorkspaces = await new PMACWorkspaceGetAllAction(fsWorkspaceManager).run()

    const promises: Promise<PostmanWorkspace>[] = []
    for (const pmacWorkspace of pmacWorkspaces) {
      if (pmacWorkspace.pmID) {
        promises.push(new PMWorkspaceFetchAction(postmanApiInstance, pmacWorkspace.pmID).run())
      }
    }

    const pmWorkspaces = await Promise.all(promises)
    const pmacPromises: Promise<PMACWorkspace>[] = []
    for (const pmWorkspace of pmWorkspaces) {
      pmacPromises.push(
        new PMWorkspacePullToPMACAction(fsWorkspaceManager, fsWorkspaceResourceManager, postmanApiInstance, pmWorkspace).run(),
      )
    }

    await Promise.all(pmacPromises)
  }
}
