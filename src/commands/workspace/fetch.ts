import { Command } from '@oclif/core'

import { WorkspaceGetAllLocalAction, WorkspacePullAction } from '../../postman/actions'
import { postmanApiInstance } from '../../postman/api'
import { PmacConfigurationManager } from '../../file-system'

export default class WorkspaceFetchPulled extends Command {
  static description = 'Fetches all pulled workspaces up-to-date.'

  static examples = [
    `$pmac workspace fetch
`,
  ]

  async run(): Promise<void> {
    await this.parse(WorkspaceFetchPulled)

    const config = new PmacConfigurationManager()
    const { localWorkspaces } = await new WorkspaceGetAllLocalAction(
      config,
    ).run()

    const promises = []
    for (const localWorkspace of localWorkspaces) {
      const pmacName = config.workspaceNameConvention(localWorkspace.name, localWorkspace.id)

      console.log(
        `Local workspace ${pmacName} (${localWorkspace.type}) fetch starting...`,
      )
      promises.push(
        new WorkspacePullAction(config, postmanApiInstance, localWorkspace).run(),
      )
    }

    await Promise.all(promises)

    console.log('All workspaces updated.')
  }
}
