import { Command, Flags } from '@oclif/core'

import inquirer from 'inquirer'

import { PMWorkspaceFetchAction, PMWorkspaceFetchAllAction, PMWorkspaceMetadataChooseAction, PMWorkspacePullToPMACAction } from '../../postman/actions'
import { postmanApiInstance } from '../../postman/api'
import { fsWorkspaceManager, fsWorkspaceResourceManager } from '../../file-system'

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
    const { pmWorkspacesMetadata } = await new PMWorkspaceFetchAllAction(
      postmanApiInstance,
    ).run()

    const chosenPMWorkspaceMetadata =
    await new PMWorkspaceMetadataChooseAction(inquirer, pmWorkspacesMetadata).run()

    const pmWorkspace = await new PMWorkspaceFetchAction(
      postmanApiInstance,
      chosenPMWorkspaceMetadata.id,
    ).run()

    await new PMWorkspacePullToPMACAction(
      fsWorkspaceManager,
      fsWorkspaceResourceManager,
      postmanApiInstance,
      pmWorkspace,
    ).run()

    this.log('Workspace pulled successfully.')
  }
}
