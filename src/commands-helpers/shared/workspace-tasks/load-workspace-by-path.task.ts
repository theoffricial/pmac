import { ListrTask } from 'listr2'
import { ICtxOptions, SharedWorkspacesTasksCtx } from '.'
import { fsWorkspaceManager } from '../../../file-system'
import { PMAC_FILE_SYS, pmacFsUtils } from '../../../file-system'
import { WorkspaceTypeValues } from '../../../postman/api/types'
type TCtxWorkspaceData =
    SharedWorkspacesTasksCtx.ICtxPmacWorkspacePath &
    SharedWorkspacesTasksCtx.ICtxSelectedWorkspace

export function loadWorkspaceByPathTask(options?: ICtxOptions): ListrTask<TCtxWorkspaceData> {
  return {
    skip: options?.skip,
    title: options?.customTitle || 'Loading pmac workspace..',
    task: async (ctx, task) => {
      const relativePath = pmacFsUtils.getRootDirRelativePath(PMAC_FILE_SYS.MAIN_DIR.WORKSPACES_DIR.path)
      const workspaceJsonName = PMAC_FILE_SYS.ENTITIES_CONVENTIONS.WORKSPACE_DATA_JSON.name
      const regexString = `${relativePath}/(${WorkspaceTypeValues.join('|')})/(.*)/${workspaceJsonName}`
      const regex = new RegExp(regexString)
      if (!ctx.pmacWorkspacePath) {
        throw new Error('pmac workspace path not specified')
      } else if (!regex.test(ctx.pmacWorkspacePath)) {
        throw new Error(`pmac workspace path is invalid, please look for pmac workspaces in paths like this: '${regexString}', and do not change the name any file under the '${PMAC_FILE_SYS.MAIN_DIR.name}' dor`)
      }

      ctx.pmacWorkspace = await fsWorkspaceManager.getPMACWorkspaceByPath(ctx.pmacWorkspacePath)
    },
  }
}
