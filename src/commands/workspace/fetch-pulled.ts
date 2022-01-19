import { Command } from '@oclif/core'

import { WorkspaceGetAllLocalAction, WorkspacePullAction } from '../../postman/actions'
import { postmanApiInstance } from '../../postman/api'
import { PmacConfigurationManager } from '../../file-system'

export default class WorkspaceFetchPulled extends Command {
  static description = 'Fetches pulled workspace to be up-to-date.'

  static examples = [
    `$pmac workspace fetch-pulled
`,
  ]

  async run(): Promise<void> {
    const { flags } = await this.parse(WorkspaceFetchPulled)

    const config = new PmacConfigurationManager()
    const { localWorkspaces } = await new WorkspaceGetAllLocalAction(
      config,
    ).run()

    const promises = []
    for (const localWorkspace of localWorkspaces) {
      console.log(
        `Local workspace [${localWorkspace.name}[type:${localWorkspace.type}][id:${localWorkspace.id}]] pull (fetching) starting...`,
      )
      promises.push(
        new WorkspacePullAction(config, postmanApiInstance, localWorkspace).run(),
      )
    }

    await Promise.all(promises)

    console.log('All workspaces updated.')
  }
}
