import { fsWorkspaceResourceManager } from '../../../file-system'
import { PMACWorkspace, PMACWorkspaceResourceIDWithWID } from '../../../file-system/types'
import { PostmanCollection } from '../../../postman/api/types'
import { BuildFetchedWorkspaceResourceType } from './types'

export async function updateOrCreateWrid(pmacWorkspace: PMACWorkspace, data: BuildFetchedWorkspaceResourceType) {
  const { identifiers, settledResult, workspaceResourceType } = data
  const { pmUID, pmacID } = identifiers

  if (settledResult.status !== 'fulfilled') {
    // skip promises that were failed
    return
  }

  const pmResource = settledResult.value
  // execute new postman collection logic

  if (!pmResource) {
    throw new Error(`Postman ${workspaceResourceType} returned is invalid`)
  }

  const existingWrid = await fsWorkspaceResourceManager.getPMACWridWithoutName({
    pmacID,
    type: workspaceResourceType,
    workspaceName: pmacWorkspace.name,
    workspaceType: pmacWorkspace.type,
    workspacePMACId: pmacWorkspace.pmacID,
  })

  if (existingWrid) {
    await fsWorkspaceResourceManager.deletePMACWorkspaceResourceFile(existingWrid)
  }

  //   throw new Error(`wrid with pmac '${pmacID}' not found`)

  const pmID = (pmResource as PostmanCollection)?.info?._postman_id || (pmResource as any).id
  const name = (pmResource as PostmanCollection)?.info?.name || (pmResource as any).name

  const newWrid: PMACWorkspaceResourceIDWithWID = {
    pmacID,
    type: existingWrid?.type || workspaceResourceType,
    workspaceName: pmacWorkspace.name,
    workspaceType: pmacWorkspace.type,
    name: name,
    workspacePMACId: pmacWorkspace.pmacID,
    pmID: pmID,
    pmUID,
  }
  await fsWorkspaceResourceManager.writeWorkspaceResourceDataJson(newWrid, pmResource)
}

