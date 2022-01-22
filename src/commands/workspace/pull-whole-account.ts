import { Command } from '@oclif/core'

import { WorkspaceFetchAction, WorkspaceFetchAllAction, WorkspacePullAction } from '../../postman/actions'
import { postmanApiInstance } from '../../postman/api'
import { PmacConfigurationManager } from '../../file-system'

export default class PullWholeAccount extends Command {
  static description = 'Pulls all workspaces within your account.'

  static examples = [
    `$pmac workspace pull-whole-account
`,
  ]

  // TODO: add api-key arg
  static args = [];
  static flags = {}

  async run(): Promise<void> {
    const { flags } = await this.parse(PullWholeAccount)

    const config = new PmacConfigurationManager()

    const { workspacesMetadata } = await new WorkspaceFetchAllAction(postmanApiInstance)
    .run()

    const fetchedActionPromises = []
    for (const localWorkspace of workspacesMetadata) {
      fetchedActionPromises.push(new WorkspaceFetchAction(postmanApiInstance, localWorkspace.id).run())
    }

    const fetchedWorkspaces = await Promise.all(fetchedActionPromises)

    const pullActionPromises = []
    for (const fetchedWorkspace of fetchedWorkspaces) {
      pullActionPromises.push(new WorkspacePullAction(config, postmanApiInstance, fetchedWorkspace.workspace).run())
    }

    await Promise.all(fetchedActionPromises)

    console.log('All workspaces updated.')
  }
}
