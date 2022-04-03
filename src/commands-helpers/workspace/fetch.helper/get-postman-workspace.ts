import { postmanApiInstance } from '../../../postman/api'

export async function getPostmanWorkspace(postmanWorkspaceId: string) {
  const {
    data: {
      workspace: postmanWorkspace,
    },
  } = await postmanApiInstance.workspaces.getWorkspaceData(postmanWorkspaceId)

  return postmanWorkspace
}

