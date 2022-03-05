import { Command } from '@oclif/core'

import { PMWorkspaceFetchAction, PMWorkspaceFetchAllAction, PMWorkspacePullToPMACAction } from '../../postman/actions'
import { postmanApiInstance } from '../../postman/api'
import { fsWorkspaceManager, fsWorkspaceResourceManager } from '../../file-system'
import { PostmanWorkspace } from '../../postman/api/types'
import { PMACWorkspace } from '../../file-system/types'

export default class PullAllPmAccount extends Command {
  static description = 'Pulls all workspaces within your account.'

  static examples = [
    `$pmac workspace pull-whole-account
`,
  ]

  static args = [];
  static flags = {}

  async run(): Promise<void> {
    await this.parse(PullAllPmAccount)

    const { pmWorkspacesMetadata } = await new PMWorkspaceFetchAllAction(postmanApiInstance)
    .run()

    const fetchedPmWorkspacePromises: Promise<PostmanWorkspace>[] = []
    for (const pmWorkspaceMetadata of pmWorkspacesMetadata) {
      fetchedPmWorkspacePromises.push(new PMWorkspaceFetchAction(postmanApiInstance, pmWorkspaceMetadata.id).run())
    }

    const fetchedWorkspaces = await Promise.all(fetchedPmWorkspacePromises)

    const pullActionPromises: Promise<PMACWorkspace>[] = []
    for (const pmWorkspace of fetchedWorkspaces) {
      pullActionPromises.push(
        new PMWorkspacePullToPMACAction(
          fsWorkspaceManager,
          fsWorkspaceResourceManager,
          postmanApiInstance,
          pmWorkspace)
        .run(),
      )
    }

    await Promise.all(pullActionPromises)

    this.log('All workspaces updated.')
  }
}
