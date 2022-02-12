import { Command } from '@oclif/core'

import { PmacConfigurationManager } from '../../file-system'
import inquirer from 'inquirer'
import { postmanApiInstance } from '../../postman/api'
import { EnvironmentFetchAllAction, EnvironmentMetadataChooseAction, EnvironmentPullAction, WorkspaceChooseAction, WorkspaceGetAllLocalAction } from '../../postman/actions'

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

    const config = new PmacConfigurationManager()

    const { localWorkspaces } = await new WorkspaceGetAllLocalAction(
      config,
    ).run()

    const { chosenWorkspace } = await new WorkspaceChooseAction(
      inquirer,
      localWorkspaces,
    ).run()

    const { environmentsMetadata } = await new EnvironmentFetchAllAction(
      postmanApiInstance,
      chosenWorkspace,
    ).run()

    const { chosenEnvironment } = await new EnvironmentMetadataChooseAction(
      inquirer,
      environmentsMetadata,
    ).run()

    await new EnvironmentPullAction(
      config,
      postmanApiInstance,
      chosenWorkspace,
      chosenEnvironment.uid,
    ).run()

    const pmacEnvironmentName = config.resourceNameConvention(chosenEnvironment.name, chosenEnvironment.uid)
    this.log(
      `Environment ${pmacEnvironmentName} pulled into repository.`,
    )
  }
}
