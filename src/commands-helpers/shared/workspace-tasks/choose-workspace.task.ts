import { ListrTask } from 'listr2'
import pad from 'pad'
import { ICtxOptions } from '.'
import { SharedWorkspacesTasksCtx } from './workspace-tasks-context.interface'

type ChoosePmacWorkspaceOptions = ICtxOptions

export function choosePmacWorkspaceTask(options?: ChoosePmacWorkspaceOptions): ListrTask<SharedWorkspacesTasksCtx.TCtxWorkspacesCombined> {
  return {
    skip: options?.skip,
    title: options?.customTitle || 'Choose workspace for action',
    task: async (ctx, task) => {
      if (!Array.isArray(ctx.pmacWorkspaces)) {
        throw new TypeError('pmac workspaces list not found')
      } else if (ctx.pmacWorkspaces.length === 0) {
        throw new TypeError('No pmac workspaces defined.')
      }

      const pmacIdPrefix = '(pmacID: '
      const pmacIdShortenVersionLength = 14
      const padBuffer = 1
      // O(n)
      const workspaceNamePad = Math.max(...ctx.pmacWorkspaces.map(w => w.name.length)) + padBuffer

      const workspacePmacIdPad = pmacIdPrefix.length + pmacIdShortenVersionLength + padBuffer

      // O(n)
      const mapped = new Map(
        ctx.pmacWorkspaces.map(w => {
          const pmacIdShorten = w.pmacID.slice(0, Math.max(0, pmacIdShortenVersionLength))
          const namePad = pad(w.name, workspaceNamePad)
          const nameAndIdPad = pad(namePad + `${pmacIdPrefix}${pmacIdShorten}..)`, workspacePmacIdPad)
          return [
            nameAndIdPad + `[${w.type}]`,
            w,
          ]
        }),
      )

      const selectedWorkspaceString = await task.prompt<string>({
        type: 'Select',
        message: 'Choose workspace for action',

        // O(n) + O(log n | n)
        choices: [...mapped.keys()].sort(),
      })

      // Assign
      // O(1)
      ctx.pmacWorkspace = mapped.get(selectedWorkspaceString)
    },
  }
}
