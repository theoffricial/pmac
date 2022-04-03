import { ListrTask } from 'listr2'
import pad from 'pad'
import { IPmacTaskOptions } from '.'
import { PMACWorkspace } from '../../../file-system/types'
import { PostmanWorkspaceMetadata } from '../../../postman/api/types'
import { SharedWorkspacesTasksCtx } from './workspace-tasks-context.interface'

export function choosePmacWorkspaceTask<T extends SharedWorkspacesTasksCtx.TPmacWorkspacesCombinedCtx>(options?: IPmacTaskOptions): ListrTask<T> {
  return {
    skip: options?.skip,
    title: options?.title || 'Choose workspace for action',
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
      ctx.pmacWorkspace = mapped.get(selectedWorkspaceString) as PMACWorkspace
    },
  }
}

export function choosePmacWorkspaceTaskV2(pmacWorkspaces: PMACWorkspace[], options?: IPmacTaskOptions): ListrTask<{ pmacWorkspace: PMACWorkspace}> {
  return {
    ...options,
    title: options?.title || 'Choose workspace',
    task: async (ctx, task) => {
      if (pmacWorkspaces.length === 0) {
        task.output = 'No workspaces found to select'
        task.cancelPrompt(true)
      }

      const mapped = buildOptionsForPmacWorkspaces(pmacWorkspaces)

      const selectedWorkspaceString = await task.prompt<string>({
        type: 'Select',
        message: 'Choose workspace for action',

        // O(n) + O(log n | n)
        choices: [...mapped.keys()].sort(),
      })

      ctx.pmacWorkspace = mapped.get(selectedWorkspaceString) as PMACWorkspace
    },
  }
}

export function choosePostmanWorkspaceMetaTask(postmanWorkspacesMeta: PostmanWorkspaceMetadata[], options?: IPmacTaskOptions): ListrTask<{ chosenWorkspace: PostmanWorkspaceMetadata }> {
  return {
    ...options,
    title: options?.title || 'Choose workspace',
    task: async (ctx, task) => {
      if (postmanWorkspacesMeta.length === 0) {
        task.output = 'No workspaces found to select'
        task.cancelPrompt(true)
      }

      const mapped = buildOptionsForPostmanWorkspacesMeta(postmanWorkspacesMeta)

      const selectedWorkspaceString = await task.prompt<string>({
        type: 'Select',
        message: 'Choose workspace for action',

        // O(n) + O(log n | n)
        choices: [...mapped.keys()].sort(),
      })

      ctx.chosenWorkspace = mapped.get(selectedWorkspaceString) as PostmanWorkspaceMetadata
    },
  }
}

function buildOptionsForPmacWorkspaces(pmacWorkspaces: PMACWorkspace[]) {
  const pmacIdPrefix = '(pmacID: '
  const pmacIdShortenVersionLength = 14
  const padBuffer = 1
  // O(n)
  const workspaceNamePad = Math.max(...pmacWorkspaces.map(w => w.name.length)) + padBuffer

  const workspacePmacIdPad = pmacIdPrefix.length + pmacIdShortenVersionLength + padBuffer

  // O(n)
  const mapped = new Map(
    pmacWorkspaces.map(w => {
      const pmacIdShorten = w.pmacID.slice(0, Math.max(0, pmacIdShortenVersionLength))
      const namePad = pad(w.name, workspaceNamePad)
      const nameAndIdPad = pad(namePad + `${pmacIdPrefix}${pmacIdShorten}..)`, workspacePmacIdPad)
      return [
        nameAndIdPad + `[${w.type}]`,
        w,
      ]
    }),
  )

  return mapped
}

function buildOptionsForPostmanWorkspacesMeta(postmanWorkspacesMeta: PostmanWorkspaceMetadata[]) {
  const pmacIdPrefix = '(pmID: '
  const pmacIdShortenVersionLength = 14
  const padBuffer = 1
  // O(n)
  const workspaceNamePad = Math.max(...postmanWorkspacesMeta.map(w => w.name.length)) + padBuffer

  const workspacePmacIdPad = pmacIdPrefix.length + pmacIdShortenVersionLength + padBuffer

  // O(n)
  const mapped = new Map(
    postmanWorkspacesMeta.map(w => {
      const pmacIdShorten = w.id.slice(0, Math.max(0, pmacIdShortenVersionLength))
      const namePad = pad(w.name, workspaceNamePad)
      const nameAndIdPad = pad(namePad + `${pmacIdPrefix}${pmacIdShorten}..)`, workspacePmacIdPad)
      return [
        nameAndIdPad + `[${w.type}]`,
        w,
      ]
    }),
  )

  return mapped
}
