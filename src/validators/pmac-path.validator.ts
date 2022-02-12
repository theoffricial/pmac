import { PmacConfigurationManager } from '../file-system'
import { WorkspaceType } from '../postman/api/types/workspace.types'

export function environmentPathValidator(testedPath: string): boolean {
  return /.*\/environments\/.*\.postman_environment\.json/.test(testedPath)
}

export function collectionPathValidator(testedPath: string): boolean {
  return /.*\/collections\/.*\.postman_collection\.json/.test(testedPath)
}

const config = new PmacConfigurationManager()
const workspaceTypePattern = `(${WorkspaceType.Personal}|${WorkspaceType.Team})`
const regexString = `.*.pmac/workspaces/${workspaceTypePattern}/`
const regex = new RegExp(regexString)
const workspaceIdRegex = new RegExp(config.WORKSPACE_ID_PATTERN)
export function workspacePathValidator(pathToVerify: string): boolean {
  return regex.test(pathToVerify) && workspaceIdRegex.test(pathToVerify)
}
