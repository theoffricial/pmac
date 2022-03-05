import { Command } from '@oclif/core'

import { PMACWorkspaceGetAllAction, PMWorkspaceFetchAction, PMWorkspacePullToPMACAction } from '../../postman/actions'
import { postmanApiInstance } from '../../postman/api'
import { fsWorkspaceManager, fsWorkspaceResourceManager } from '../../file-system'
import { PostmanWorkspace } from '../../postman/api/types'
import { PMACWorkspace } from '../../file-system/types'

export default class WorkspaceFetchPulled extends Command {
  static description = 'Fetches all pulled workspaces up-to-date.'

  static examples = [
    `$pmac workspace fetch
`,
  ]

  async run(): Promise<void> {
    await this.parse(WorkspaceFetchPulled)

    const pmacWorkspaces = await new PMACWorkspaceGetAllAction(fsWorkspaceManager).run()

    const promises: Promise<PostmanWorkspace>[] = []
    for (const pmacWorkspace of pmacWorkspaces) {
      if (pmacWorkspace.pmID) {
        promises.push(new PMWorkspaceFetchAction(postmanApiInstance, pmacWorkspace.pmID).run())
      }
      // console.log(
      //   `Local workspace ${pmacWorkspace.name} (${pmacWorkspace.type}) fetch starting...`,
      // )
    }

    const pmWorkspaces = await Promise.all(promises)
    const pmacPromises: Promise<PMACWorkspace>[] = []
    for (const pmWorkspace of pmWorkspaces) {
      pmacPromises.push(
        new PMWorkspacePullToPMACAction(fsWorkspaceManager, fsWorkspaceResourceManager, postmanApiInstance, pmWorkspace).run(),
      )
    }

    await Promise.all(pmacPromises)

    // console.log('All workspaces updated.')
  }
}
