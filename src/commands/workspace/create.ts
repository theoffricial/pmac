import { Command, Flags } from '@oclif/core'
import { Listr, ListrTask } from 'listr2'
import { WorkspaceTypeValues } from '../../postman/api/types'

import { PmacWorkspaceCreateCtx, workspaceCreateCommandHelper } from '../../commands-helpers/workspace/create.helper'
export default class WorkspaceCreate extends Command {
  static description = 'Creates new PMAC collection'

  static examples = [
    '$pmac collection create',
  ]

  static flags = {
    'api-key': Flags.string({ char: 'k', description: 'Dynamic api key', required: false, helpValue: '<your PM api key>' }),
    name: Flags.string({ char: 'n', description: 'Sets the workspace name without need for stdin question', helpValue: '<name>', required: false }),
    type: Flags.enum({ char: 't', options: WorkspaceTypeValues, description: 'Sets the workspace type without need for stdin question.', required: false, helpValue: '<type>' }),
    'skip-description': Flags.boolean({ char: 's', description: 'Skips questioning for workspace description and set it to an empty string.', required: false, default: false }),
  }

  async run(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { args, flags } = await this.parse(WorkspaceCreate)

    const subTasks: ListrTask<PmacWorkspaceCreateCtx>[] = []

    if (!flags.name) {
      subTasks.push(workspaceCreateCommandHelper.setWorkspaceNameTask)
    }

    if (!flags.type) {
      subTasks.push(workspaceCreateCommandHelper.setWorkspaceTypeTask)
    }

    if (!flags['skip-description']) {
      subTasks.push(workspaceCreateCommandHelper.setWorkspaceDescriptionTask)
    }

    subTasks.push(
      // order matters
      workspaceCreateCommandHelper.buildWorkspaceJsonTask,
      workspaceCreateCommandHelper.createWorkspaceDirTask,
      workspaceCreateCommandHelper.writeWorkspaceJsonToDirTask,
    )

    const mainTask = new Listr<PmacWorkspaceCreateCtx>([
      {
        title: 'Creating a new pmac workspace',
        task: (_ctx, task) => task.newListr(subTasks),
      },
    ],
    {
      ctx: {
        workspaceName: flags.name || '',
        workspaceType: flags.type,
      } as any,
      rendererOptions: { showTimer: true },
    })

    const ctx = await mainTask.run()

    if (!ctx.pmacWorkspace) {
      this.error('pmac cannot complete workspace create when no workspace json is defined.')
    }

    this.log(
      `Workspace ${ctx.workspaceName} pmacID:${ctx.pmacWorkspace.pmacID} created successfully.`,
    )
  }
}
