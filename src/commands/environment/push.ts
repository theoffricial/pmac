import { Command } from '@oclif/core'

import { PmacConfigurationManager } from '../../file-system'
import inquirer from 'inquirer'
import { postmanApiInstance } from '../../postman/api'
import { EnvironmentChooseAction, EnvironmentGetAllLocalAction, EnvironmentGetMetadataAction, EnvironmentMetadataChooseAction, EnvironmentPushAction, WorkspaceChooseAction, WorkspaceGetAllLocalAction } from '../../postman/actions'

export default class EnvironmentPush extends Command {
  static description = 'Pushes (Fetches) environment updates to your PM account (remote) from your .pmac (repository).'

  static examples = [
    `$pmac environment push
`,
  ]

  static flags = {
    // TODO: Make environment flag work.
    // environment: Flags.string({
    //   char: 'c',
    //   description: 'Path to your environment JSON definition.',
    //   helpValue: './path/to/your/environment-definition.json',
    //   required: false,
    // }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(EnvironmentPush)

    const config = new PmacConfigurationManager()
    const { localWorkspaces } = await config.getWorkspaces()

    const { chosenWorkspace } = await new WorkspaceChooseAction(
      inquirer,
      localWorkspaces,
    ).run()

    const { localEnvironments } = await new EnvironmentGetAllLocalAction(
      config,
      chosenWorkspace,
    ).run()

    if (localEnvironments.length === 0) {
      this.error('No environments found', { exit: 1 })
    }

    const { chosenEnvironment } = await new EnvironmentChooseAction(
      inquirer,
      localEnvironments,
    ).run()

    const { environmentMetadata } = await new EnvironmentGetMetadataAction(chosenWorkspace, chosenEnvironment).run()

    if (!environmentMetadata) {
      this.error('Environment not found', { exit: 1 })
    }

    const { environment } = await new EnvironmentPushAction(
      config,
      postmanApiInstance,
      chosenWorkspace,
      environmentMetadata.uid,
      chosenEnvironment,
    ).run()

    this.log(`Environment '${environmentMetadata.uid}' updated`)
  }
}
