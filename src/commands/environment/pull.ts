import { Command } from '@oclif/core'

import { fsWorkspaceManager, fsWorkspaceResourceManager } from '../../file-system'
import inquirer from 'inquirer'
import { postmanApiInstance } from '../../postman/api'
import { PMEnvironmentFetchAllAction, PMEnvironmentMetadataChooseAction, PMEnvironmentPullToPMACAction, PMACWorkspaceChooseAction, PMACWorkspaceGetAllAction } from '../../postman/actions'

export default class EnvironmentPull extends Command {
  static description = 'Pulls (Fetches) new updates about an existing collection on your .pmac (repository).'

  static examples = [
    `$pmac collection pull
`,
  ]

  static flags = {
    // eslint-disable-next-line no-warning-comments
    // TODO: Make collection flag work.
    // collection: Flags.string({
    //   char: 'c',
    //   description: 'Path to your collection JSON definition.',
    //   helpValue: './path/to/your/collection-definition.json',
    //   required: false,
    // }),
  }

  async run(): Promise<void> {
    await this.parse(EnvironmentPull)

    const pmacWorkspaces = await new PMACWorkspaceGetAllAction(
      fsWorkspaceManager,
    ).run()

    const pmacWorkspace = await new PMACWorkspaceChooseAction(
      inquirer,
      pmacWorkspaces,
    ).run()

    const pmEnvironmentsMetadata = await new PMEnvironmentFetchAllAction(
      postmanApiInstance,
      pmacWorkspace,
    ).run()

    const pmEnvironmentMetadata = await new PMEnvironmentMetadataChooseAction(
      inquirer,
      pmEnvironmentsMetadata,
    ).run()

    await new PMEnvironmentPullToPMACAction(
      fsWorkspaceResourceManager,
      postmanApiInstance,
      pmacWorkspace,
      pmEnvironmentMetadata.uid,
    ).run()

    this.log(
      `Environment ${pmEnvironmentMetadata.name} pulled into pmac.`,
    )
  }
}
