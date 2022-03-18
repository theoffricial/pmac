import { ListrTask } from 'listr2'
import { fsWorkspaceManager, PMACMap } from '../../file-system'
import { WorkspaceType, WorkspaceTypeValues } from '../../postman/api/types'
import { SharedWorkspacesTasksCtx } from '../shared/workspace-tasks/workspace-tasks-context.interface'

export interface PmacWorkspaceCreateCtx extends SharedWorkspacesTasksCtx.ICtxSelectedWorkspace {
    workspaceName: string
    workspaceType: WorkspaceType
    workspaceDescription?: string
}

const setWorkspaceNameTask: ListrTask<PmacWorkspaceCreateCtx> = {
  title: 'Enter a name for the new workspace',
  task: async (ctx, task) => {
    const workspaceName = await task.prompt<string>({
      type: 'input',
      message: 'Enter a name for the new workspace',
      name: 'name',
    })
    ctx.workspaceName = workspaceName
  },
}

const setWorkspaceTypeTask: ListrTask<PmacWorkspaceCreateCtx> = {
  title: 'Enter a name for the new workspace',
  task: async (ctx, task) => {
    const workspaceType = await task.prompt<WorkspaceType>({
      type: 'Select',
      message: 'Select workspace type',
      choices: WorkspaceTypeValues,

    })
    ctx.workspaceType = workspaceType
  },
}

const setWorkspaceDescriptionTask: ListrTask<PmacWorkspaceCreateCtx> = {
  title: 'Enter a name for the new workspace',
  task: async (ctx, task) => {
    const workspaceDescription = await task.prompt<string>({
      type: 'input',
      message: 'Add description to the workspace [optional]',
      name: 'description',
      default: '',
    })
    ctx.workspaceDescription = workspaceDescription
  },
}

const buildWorkspaceJsonTask: ListrTask<PmacWorkspaceCreateCtx> = {
  title: 'Building a new workspace json',
  task: async ctx => {
    ctx.pmacWorkspace = {
      pmacID: PMACMap.generatePMACuuid(),
      pmID: '',
      pmUID: '',
      description: ctx.workspaceDescription || '',
      name: ctx.workspaceName,
      type: ctx.workspaceType,
      collections: [],
      environments: [],
      mocks: [],
      monitors: [],
    }
  },
}

const createWorkspaceDirTask: ListrTask<PmacWorkspaceCreateCtx> =  {
  title: 'Creating a new directory for workspace',
  task: async ctx => {
    if (!ctx.pmacWorkspace) {
      throw new Error('Cannot complete workspace directory creation when workspace json is not defined.')
    }

    await fsWorkspaceManager.createPMACWorkspaceDir(ctx.pmacWorkspace)
  },
}

const writeWorkspaceJsonToDirTask: ListrTask<PmacWorkspaceCreateCtx> = {
  title: 'Writing the new workspace json to workspace directory',
  task: async ctx => {
    if (!ctx.pmacWorkspace) {
      throw new Error('Cannot complete workspace json file creation when workspace json is not defined.')
    }

    await fsWorkspaceManager.writeWorkspaceDataJson(ctx.pmacWorkspace)
  },
}
export const workspaceCreateCommandHelper = {
  setWorkspaceNameTask,
  setWorkspaceTypeTask,
  setWorkspaceDescriptionTask,
  buildWorkspaceJsonTask,
  createWorkspaceDirTask,
  writeWorkspaceJsonToDirTask,
}
