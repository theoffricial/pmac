import { Command, Flags } from '@oclif/core'

import inquirer from 'inquirer'

import { WorkspaceFetchAction, WorkspaceFetchAllAction, WorkspaceMetadataChooseAction, WorkspacePullAction } from '../../postman/actions'
import { postmanApiInstance } from '../../postman/api'
import { PmacConfigurationManager } from '../../file-system'

export default class WorkspacePull extends Command {
  static description = 'Pulls a single workspace from PM account'

  static examples = [
    `$pmac workspace pull
`,
  ]

  static flags = {
    id: Flags.string({ description: 'workspace id', required: false, helpValue: '<workspace specific id>' }),
    name: Flags.string({ char: 'n', description: 'The exact name of your workspace, on name duplication will pick first match.', required: false, helpValue: '<workspace name>' }),
  }

  async run(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { flags } = await this.parse(WorkspacePull)

    const { workspacesMetadata } = await new WorkspaceFetchAllAction(
      postmanApiInstance,
    ).run()

    const { chosenWorkspaceMetadata: chosenWorkspace } =
    await new WorkspaceMetadataChooseAction(inquirer, workspacesMetadata).run()

    const { workspace } = await new WorkspaceFetchAction(
      postmanApiInstance,
      chosenWorkspace.id,
    ).run()
    const config = new PmacConfigurationManager()

    await new WorkspacePullAction(config, postmanApiInstance, workspace).run()

    console.log('Workspace pulled successfully.\n')
  }
}
