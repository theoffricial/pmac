// eslint-disable-next-line unicorn/prefer-node-protocol
import fsPromises from 'fs/promises'
// get a new postman workspace
// unify pm workspace json with pmac w json
import { PMACWorkspace, PMACWorkspaceID } from './types'
import { PMAC_FILE_SYS } from './fs-pmac.constants'
import { pmacFsUtils } from './fs-utils'
import { WorkspaceResource, WorkspaceType } from '../postman/api/types'
import { globMultiPromise } from './glob-promise'

const { WORKSPACE_NAME_TO_ID_SEPARATOR } = PMAC_FILE_SYS.ENTITIES_CONVENTIONS.NAME_CONVENTIONS

function buildPMACWorkspaceName(name: string, pmacID: string) {
  return `${name}${WORKSPACE_NAME_TO_ID_SEPARATOR}${pmacID}`
}

export function buildPMACWorkspaceDirPathByWid(wid: PMACWorkspaceID) {
  const { pmacID, name, type } = wid
  const pmacWorkspaceName = buildPMACWorkspaceName(name, pmacID)
  const upath = `${type}/${pmacWorkspaceName}`
  return `${PMAC_FILE_SYS.MAIN_DIR.WORKSPACES_DIR.path}/${upath}`
}

function buildPMACWorkspaceDataJsonPath(wid: PMACWorkspaceID) {
  const workspaceDirPath = buildPMACWorkspaceDirPathByWid(wid)
  const { WORKSPACE_DATA_JSON } = PMAC_FILE_SYS.ENTITIES_CONVENTIONS
  return `${workspaceDirPath}/${WORKSPACE_DATA_JSON.name}`
}

export async function getPMACWorkspaceByWid(wid: PMACWorkspaceID): Promise<PMACWorkspace> {
  const path = buildPMACWorkspaceDataJsonPath(wid)
  return getPMACWorkspaceByPath(path)
}

export async function getPMACWorkspaceByPath(path: string): Promise<PMACWorkspace> {
  const workspace: PMACWorkspace = await pmacFsUtils.readJsonFile(path)
  return workspace
}

export function getPMACIdAndNameByDirName(workspaceDirName: string) {
  const { WORKSPACE_NAME_TO_ID_SEPARATOR } = PMAC_FILE_SYS.ENTITIES_CONVENTIONS.NAME_CONVENTIONS
  const parts = workspaceDirName.split(WORKSPACE_NAME_TO_ID_SEPARATOR)
  const pmacID = parts.pop() || ''
  // in case name contains the separator
  const name = parts.join(WORKSPACE_NAME_TO_ID_SEPARATOR)

  return { name, pmacID }
}

/** Path should contains the PMAC main dir */
export function getPMACWidByDirPath(path: string) {
  const { MAIN_DIR } = PMAC_FILE_SYS
  // ......./.pmac/workspaces/<type>/<name>/.....
  const parts1 = path.split(MAIN_DIR.name)
  const pmacPath = parts1.pop()
  // /workspaces/<type>/<name>/......
  const parts2 = pmacPath?.split('/')
  const [, _workspacesDirName, workspaceType, workspaceName] = parts2 || []

  const { name, pmacID } = getPMACIdAndNameByDirName(workspaceName)

  return { name, pmacID, type: workspaceType } as PMACWorkspaceID
}

/** Risky function! 2-steps, on failure there is risk for inconsistent data! */
export async function renamePMACWorkspaceName(wid: PMACWorkspaceID, newName: string) {
  // rename dir name
  const currentPath = buildPMACWorkspaceDirPathByWid(wid)
  const newPath = buildPMACWorkspaceDirPathByWid({
    ...wid,
    name: newName,
  })
  await fsPromises.rename(currentPath, newPath)

  // update workspace name in data-json
  const workspace = await getPMACWorkspaceByWid(wid)
  await writeWorkspaceDataJson({ ...workspace, name: newName })
}

export async function writeWorkspaceDataJson(workspace: PMACWorkspace) {
  const path = buildPMACWorkspaceDirPathByWid(workspace)
  const combined = `${path}/${PMAC_FILE_SYS.ENTITIES_CONVENTIONS.WORKSPACE_DATA_JSON.name}`
  await pmacFsUtils.writeJsonFile(combined, workspace)
}

/** Risky function! 2-steps, on failure there is risk for inconsistent data! */
export async function changePMACWorkspaceType(wid: PMACWorkspaceID, newType: WorkspaceType) {
  // rename dir name
  const currentPath = buildPMACWorkspaceDirPathByWid(wid)
  const newPath = buildPMACWorkspaceDirPathByWid({
    ...wid,
    type: newType,
  })
  await fsPromises.rename(currentPath, newPath)

  // update workspace name in data-json
  const workspace = await getPMACWorkspaceByWid(wid)
  await writeWorkspaceDataJson({ ...workspace, type: newType })
}

export async function deletePMACWorkspaceByWid(wid: PMACWorkspaceID) {
  const workspaceDirPath = buildPMACWorkspaceDirPathByWid(wid)

  await fsPromises.rm(workspaceDirPath, { force: true, recursive: true })
}

export async function getAllPMACWorkspaces(type?: WorkspaceType): Promise<PMACWorkspace[]> {
  const paths = await getAllExistsPMACWorkspacesPaths(type)

  const promises = []
  for (const path of paths) {
    promises.push(getPMACWorkspaceByPath(path))
  }

  const workspaces = await Promise.all(promises)

  return workspaces
}

async function getAllExistsPMACWorkspacesPaths(type?: WorkspaceType) {
  const personalPattern = buildPMACWorkspaceDataJsonPath({ type: WorkspaceType.Personal, name: '*', pmacID: '*' })
  const teamPattern = buildPMACWorkspaceDataJsonPath({ type: WorkspaceType.Team, name: '*', pmacID: '*' })

  const patterns = type ?
    ((type === WorkspaceType.Personal) ?
      [personalPattern] :
      [teamPattern]) :
    [personalPattern, teamPattern]

  const paths = await globMultiPromise(patterns)

  return paths
}

import { isMainDirExists } from './fs-main-dir-manager'

export async function createPMACWorkspaceDir(pmacWorkspace: PMACWorkspace) {
  if (!isMainDirExists()) {
    // replace this error with global errors
    throw new Error('pmac not found, run \'pmac init\'')
  }

  const pmacWorkspaceDirPath = buildPMACWorkspaceDirPathByWid(pmacWorkspace)

  await fsPromises.mkdir(pmacWorkspaceDirPath)

  await Promise.all([
    fsPromises.mkdir(`${pmacWorkspaceDirPath}/${WorkspaceResource.Collection}s`),
    fsPromises.mkdir(`${pmacWorkspaceDirPath}/${WorkspaceResource.Environment}s`),
    fsPromises.mkdir(`${pmacWorkspaceDirPath}/${WorkspaceResource.Mock}s`),
    fsPromises.mkdir(`${pmacWorkspaceDirPath}/${WorkspaceResource.Monitor}s`),
  ])
}

export async function getPMACWorkspaceByPMWorkspaceId(pmWorkspaceId: string) {
  const pmacWorkspaces = await getAllPMACWorkspaces()
  return pmacWorkspaces.find(pmacW => pmacW.pmID === pmWorkspaceId)
}

