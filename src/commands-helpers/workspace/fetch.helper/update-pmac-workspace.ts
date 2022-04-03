import { PMACMap } from '../../../file-system'
import { PMAC_MAP } from '../../../file-system/types/pmac-map'
import { PostmanWorkspace } from '../../../postman/api/types'
import { PartialBy, RequiredWorkspaceDataForFetch } from './types'

type PostmanWorkspaceApiReturned = PartialBy<PostmanWorkspace, 'collections' | 'environments' | 'monitors' | 'mocks'>

export function updatePmacWorkspace(existingPmacWorkspace: RequiredWorkspaceDataForFetch, postmanWorkspace: PostmanWorkspaceApiReturned): RequiredWorkspaceDataForFetch {
  const pmacExistingCollections = new Map(
    existingPmacWorkspace.collections
    .filter(c => c.pmUID && typeof c.pmUID === 'string')
    .map(pmacC => ([pmacC.pmUID || '', pmacC])),
  )
  const pmacExistingEnvironments = new Map(
    existingPmacWorkspace.environments
    .filter(e => e.pmUID)
    .map(pmacE => ([pmacE.pmUID || '', pmacE])),
  )

  const pmacCollections: PMAC_MAP[] | undefined = postmanWorkspace.collections?.map(postmanCollectionMetadata => ({
    pmacID: pmacExistingCollections.get(postmanCollectionMetadata.uid)?.pmacID || PMACMap.generatePMACuuid(),
    pmID: postmanCollectionMetadata.id,
    pmUID: postmanCollectionMetadata.uid,
  })) || []

  const pmacEnvironments: PMAC_MAP[] | undefined = postmanWorkspace.environments?.map(postmanEnvironmentMetadata => ({
    pmacID: pmacExistingEnvironments.get(postmanEnvironmentMetadata.uid)?.pmacID || PMACMap.generatePMACuuid(),
    pmID: postmanEnvironmentMetadata.id,
    pmUID: postmanEnvironmentMetadata.uid,
  })) || []

  return {
    pmacID: existingPmacWorkspace.pmacID,
    pmID: existingPmacWorkspace.pmID,
    description: postmanWorkspace.description,
    name: postmanWorkspace.name,
    type: postmanWorkspace.type,
    collections: pmacCollections,
    environments: pmacEnvironments,
    mocks: [],
    monitors: [],
  }
}
