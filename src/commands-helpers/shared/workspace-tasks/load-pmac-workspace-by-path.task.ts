import { ListrTask } from 'listr2'
import { IPmacTaskOptions, SharedWorkspacesTasksCtx } from '.'
import { fsWorkspaceManager } from '../../../file-system'
import { PMAC_FILE_SYS, pmacFsUtils } from '../../../file-system'
import { WorkspaceTypeValues } from '../../../postman/api/types'

type TCtxWorkspaceData =
    SharedWorkspacesTasksCtx.ISelectedPmacWorkspacePathCtx &
    Partial<SharedWorkspacesTasksCtx.ISelectedPmacWorkspaceCtx>

const workspaceJsonName = PMAC_FILE_SYS.ENTITIES_CONVENTIONS.WORKSPACE_DATA_JSON.name
const relativePath = pmacFsUtils.getRootDirRelativePath(PMAC_FILE_SYS.MAIN_DIR.WORKSPACES_DIR.path)
// workspace json valid path
const pmacWorkspaceJsonValidPathRegexString = `${relativePath}/(${WorkspaceTypeValues.join('|')})/(.*)/${workspaceJsonName}`
const pmacWorkspaceJsonValidPathRegex = new RegExp(pmacWorkspaceJsonValidPathRegexString)

export function loadWorkspaceByPathTask<T extends TCtxWorkspaceData>(pmacWorkspacePath: string, options?: IPmacTaskOptions): ListrTask<T> {
  return {
    skip: options?.skip,
    title: options?.title || 'Loading pmac workspace from path',
    task: async (ctx, task) => {
      const normalizedPmacWorkspacePath =  pmacWorkspacePath || ctx.pmacWorkspacePath
      if (!normalizedPmacWorkspacePath) {
        throw new Error('pmac workspace path not specified')
      } else if (!pmacWorkspaceJsonValidPathRegex.test(normalizedPmacWorkspacePath)) {
        throw new Error(`pmac workspace path is invalid, please look for pmac workspaces in paths like this: '${pmacWorkspaceJsonValidPathRegexString}', and do not change the name any file under the '${PMAC_FILE_SYS.MAIN_DIR.name}' dor`)
      }

      const pmacWorkspace = await fsWorkspaceManager.getPMACWorkspaceByPath(normalizedPmacWorkspacePath)

      ctx.pmacWorkspace = pmacWorkspace
    },
  }
}
