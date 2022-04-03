// eslint-disable-next-line unicorn/prefer-node-protocol
import fsPromises from 'fs/promises'
import { WorkspaceResource } from '../postman/api/types'
import { PMAC_FILE_SYS } from './fs-pmac.constants'
import { pmacFsUtils } from './fs-utils'
import { buildPMACWorkspaceDirPathByWid, getPMACWidByDirPath, getPMACWorkspaceByWid, writeWorkspaceDataJson } from './fs-workspace-manager'
import { ResourceTypeMap, WORKSPACE_RESOURCES_DEFINITIONS, PM_RESOURCE_PREFIX } from './fs-workspace-resource.constants'
import { globPromise } from './glob-promise'
import { PMACWorkspace, PMACWorkspaceID, PMACWorkspaceResourceID, PMACWorkspaceResourceIDWithWID } from './types'

const { WORKSPACE_RESOURCE_NAME_TO_ID_SEPARATOR } = PMAC_FILE_SYS.ENTITIES_CONVENTIONS.NAME_CONVENTIONS

function buildPMACWorkspaceResourceName(name: string, pmacID: string) {
  return `${name}${WORKSPACE_RESOURCE_NAME_TO_ID_SEPARATOR}${pmacID}`
}

export function buildPMACWorkspaceResourceFilePathByWrid(wrid: PMACWorkspaceResourceIDWithWID) {
  const { workspaceName, workspacePMACId, workspaceType } = wrid
  const workspacePath = buildPMACWorkspaceDirPathByWid({ type: workspaceType, pmacID: workspacePMACId, name: workspaceName, pmID: '' })

  const { pmacID, name, type } = wrid
  const pmacResourceName = buildPMACWorkspaceResourceName(name, pmacID)
  const { fileSuffixAndExt } = WORKSPACE_RESOURCES_DEFINITIONS[type]
  return `${workspacePath}/${type}s/${pmacResourceName}.${fileSuffixAndExt}`
}

export async function getPMACWorkspaceResourceByWrid<T extends WorkspaceResource>(wrid: PMACWorkspaceResourceIDWithWID): Promise<ResourceTypeMap<T>> {
  const path = buildPMACWorkspaceResourceFilePathByWrid(wrid)
  const resource = await getPMACWorkspaceResourceByPath<T>(path)
  return resource
}

export async function getPMACWorkspaceResourceByPath<T extends WorkspaceResource>(path: string): Promise<ResourceTypeMap<T>> {
  const workspaceResource: ResourceTypeMap<T> = await pmacFsUtils.readJsonFile(path)
  return workspaceResource
}

export function getPMACWorkspaceResourceIDByFileName(workspaceResourceFileName: string): PMACWorkspaceResourceID {
  // name.suffix.json
  console.log('split issue for:', getPMACWorkspaceResourceIDByFileName.name)

  const [workspaceResourceName, suffix, _ext] = workspaceResourceFileName.split('.')
  const type = suffix.replace(PM_RESOURCE_PREFIX, '') as WorkspaceResource
  const parts = workspaceResourceName.split(WORKSPACE_RESOURCE_NAME_TO_ID_SEPARATOR)
  const pmacID = parts.pop() || ''
  // in case name contains the separator
  const name = parts.join(WORKSPACE_RESOURCE_NAME_TO_ID_SEPARATOR)

  return { name, pmacID, type }
}

export function getPMACWorkspaceResourceIDByFilePath(path: string) {
  const workspaceId = getPMACWidByDirPath(path)
  const { MAIN_DIR } = PMAC_FILE_SYS
  // ......./.pmac/workspaces/<type>/<name>/resource-type/resource-file-name.....
  const parts1 = path.split(MAIN_DIR.name)
  const pmacPath = parts1.pop()
  const pmacPathParts = pmacPath?.split('/') || []
  const resourceFileName = pmacPathParts.pop()

  if (!resourceFileName) {
    return
  }

  const { name, pmacID, type } = getPMACWorkspaceResourceIDByFileName(resourceFileName)

  return {
    workspacePMACId: workspaceId.pmacID,
    workspaceName: workspaceId.name,
    workspaceType: workspaceId.type,
    name,
    pmacID,
    type,
  } as PMACWorkspaceResourceIDWithWID
}

export async function writeWorkspaceResourceDataJson<T extends WorkspaceResource>(wrid: PMACWorkspaceResourceIDWithWID, resourceData: ResourceTypeMap<T>) {
  const path = buildPMACWorkspaceResourceFilePathByWrid(wrid)
  await pmacFsUtils.writeJsonFile(path, resourceData)
}

/** this funciton is responsible only for the PMAC related changes */
export async function renamePMACWorkspaceResourceName<T extends WorkspaceResource>(wrid: PMACWorkspaceResourceIDWithWID, newResourceName: string, resourceUpdatedData: ResourceTypeMap<T>) {
  const currentPath = buildPMACWorkspaceResourceFilePathByWrid(wrid)
  const newPath = buildPMACWorkspaceResourceFilePathByWrid({
    ...wrid,
    name: newResourceName,
  })
  await fsPromises.rename(currentPath, newPath)

  await writeWorkspaceResourceDataJson(wrid, resourceUpdatedData)
}

export async function deletePMACWorkspaceResourceFile(wrid: PMACWorkspaceResourceIDWithWID) {
  const resourcePath = buildPMACWorkspaceResourceFilePathByWrid(wrid)

  await fsPromises.rm(resourcePath)
}

export async function deletePMACWorkspaceResourceRecordFromPMACWorkspace(wrid: PMACWorkspaceResourceIDWithWID) {
  const workspaceJson = await getPMACWorkspaceByWid({
    name: wrid.workspaceName,
    pmacID: wrid.workspacePMACId,
    type: wrid.workspaceType,
  })

  const resourceArray = workspaceJson[`${wrid.type}s`]

  if (!resourceArray) {
    throw new Error("pmac workspace's resource array not found")
  }

  const filtered = resourceArray.filter(r => r.pmacID !== wrid.pmacID)

  workspaceJson[`${wrid.type}s`] = filtered

  await writeWorkspaceDataJson(workspaceJson)
}

export async function cleanPMIDsFromPMACWorkspaceResourceRecordFromPMACWorkspace(wrid: PMACWorkspaceResourceIDWithWID) {
  const workspaceJson = await getPMACWorkspaceByWid({
    name: wrid.workspaceName,
    pmacID: wrid.workspacePMACId,
    type: wrid.workspaceType,
  })
  const resourceArray = workspaceJson[`${wrid.type}s`]

  if (!resourceArray) {
    throw new Error("pmac workspace's resource array not found")
  }

  const pmacMap = resourceArray.find(r => r.pmacID === wrid.pmacID)

  if (!pmacMap) {
    return
  }

  const filtered = resourceArray?.filter(r => r.pmacID !== wrid.pmacID && r.pmUID !== wrid.pmUID)

  filtered?.push({
    pmacID: pmacMap.pmacID,
    pmID: '',
    pmUID: '',
  })

  workspaceJson[`${wrid.type}s`] = filtered

  await writeWorkspaceDataJson(workspaceJson)
}

export async function deletePMACWorkspaceResourceByWrid(wrid: PMACWorkspaceResourceIDWithWID) {
  await deletePMACWorkspaceResourceFile(wrid)
  await deletePMACWorkspaceResourceRecordFromPMACWorkspace(wrid)
}

export async function deleteAllPMACWorkspaceResources(pmacWorkspace: PMACWorkspace) {
  const pmacCollectionsDeletePromises = []
  for (const pmacCol of pmacWorkspace.collections || []) {
    pmacCollectionsDeletePromises.push(
      deletePMACWorkspaceResourceFileWithoutName({
        pmacID: pmacCol.pmacID,
        type: WorkspaceResource.Collection,
        workspaceName: pmacWorkspace.name,
        workspacePMACId: pmacWorkspace.pmacID,
        workspaceType: pmacWorkspace.type,
      }),
    )
  }

  for (const pmacCol of pmacWorkspace.environments || []) {
    pmacCollectionsDeletePromises.push(
      deletePMACWorkspaceResourceFileWithoutName({
        pmacID: pmacCol.pmacID,
        type: WorkspaceResource.Environment,
        workspaceName: pmacWorkspace.name,
        workspacePMACId: pmacWorkspace.pmacID,
        workspaceType: pmacWorkspace.type,
      }),
    )
  }

  await Promise.all(pmacCollectionsDeletePromises)
}

export async function getAllPMACWorkspaceResourcesByPattern<T extends WorkspaceResource>(wid: PMACWorkspaceID, resourceType: T, pattern: string): Promise<ResourceTypeMap<T>[]> {
  const pmacWorkspacePath = buildPMACWorkspaceDirPathByWid(wid)
  const p = `${pmacWorkspacePath}/${resourceType}s/${pattern}`
  const matches = await globPromise(p)

  const promises = []

  for (const path of matches) {
    promises.push(getPMACWorkspaceResourceByPath<T>(path))
  }

  const resources = await Promise.all(promises)

  return resources
}

export async function getAllPMACWorkspaceResourcesMapByPattern<T extends WorkspaceResource>(wid: PMACWorkspaceID, resourceType: T, pattern: string): Promise<Map<string, ResourceTypeMap<T>>> {
  const pmacWorkspacePath = buildPMACWorkspaceDirPathByWid(wid)
  const p = `${pmacWorkspacePath}/${resourceType}s/${pattern}`
  const matches = await globPromise(p)

  const promises = []

  const map = new Map<string, ResourceTypeMap<T>>()
  console.log('split issue for:', getAllPMACWorkspaceResourcesMapByPattern.name)
  for (const path of matches) {
    promises.push(getPMACWorkspaceResourceByPath<T>(path).then(resourceData => {
      const parts = path.split('/')
      const resourceFileName = parts[parts.length - 1]
      const { pmacID } = getPMACWorkspaceResourceIDByFileName(resourceFileName)
      map.set(pmacID, resourceData)
      return resourceData
    }))
  }

  await Promise.all(promises)

  return map
}

// No name functions
export async function deletePMACWorkspaceResourceByWridWithoutName(wrid: Omit<PMACWorkspaceResourceIDWithWID, 'name'>) {
  const fullWrid = await getPMACWridWithoutName(wrid)

  if (fullWrid) {
    await deletePMACWorkspaceResourceFile(fullWrid)
    await deletePMACWorkspaceResourceRecordFromPMACWorkspace(fullWrid)
  }
}

export async function deletePMACWorkspaceResourceFileWithoutName(wrid: Omit<PMACWorkspaceResourceIDWithWID, 'name'>) {
  const fullWrid = await getPMACWridWithoutName(wrid)

  if (fullWrid) {
    const resourcePath = buildPMACWorkspaceResourceFilePathByWrid(fullWrid)
    await fsPromises.rm(resourcePath)
  }
}

export async function getPMACWridWithoutName(wrid: Omit<PMACWorkspaceResourceIDWithWID, 'name'>) {
  const pattern = buildPMACWorkspaceResourceFilePathByWrid({ ...wrid, name: '*' })
  const [path] = await globPromise(pattern)

  if (!path) {
    return
  }

  const fullWrid = getPMACWorkspaceResourceIDByFilePath(path)
  return fullWrid
}

export async function getPMACWorkspaceResourceByWridWithoutName<T extends WorkspaceResource>(wrid: Omit<PMACWorkspaceResourceIDWithWID, 'name'>): Promise<ResourceTypeMap<T> | undefined> {
  const fullWrid = await getPMACWridWithoutName(wrid)

  if (fullWrid) {
    const path = buildPMACWorkspaceResourceFilePathByWrid(fullWrid)
    const resource = await getPMACWorkspaceResourceByPath<T>(path)
    return resource
  }
}
