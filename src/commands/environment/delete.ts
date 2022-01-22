import { Command, Flags } from '@oclif/core'

import inquirer from 'inquirer'
import { PmacConfigurationManager } from '../../file-system'
import { postmanApiInstance } from '../../postman/api'
import { EnvironmentDeleteLocalAction, EnvironmentDeleteRemoteAction, EnvironmentFetchAllAction, EnvironmentMetadataChooseAction, WorkspaceChooseAction, WorkspaceGetAllLocalAction } from '../../postman/actions'

import { EnvironmentDeleteAction } from '../../postman/actions/environment-delete.action'

export default class EnvironmentDelete extends Command {
  static description = 'Deletes PM environment. default: Deletes from both .pmac (repository), and PM account (remote).'

  static examples = [
    `$pmac environment delete
`,
  ]

  static flags = {
    'remote-only': Flags.boolean({ char: 'r', description: 'Removes environment only from your PM account, keeps workspace in .pmac (repository)', required: false }),
    'local-only': Flags.boolean({ char: 'l', description: 'Removes environment only from .pmac, keeps workspace in your PM account (remote)', required: false }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(EnvironmentDelete)

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

    const pmacEnvironmentName = config.resourceNameConvention(chosenEnvironment.name, chosenEnvironment.uid)

    if (flags['local-only']) {
      const { deletedEnvironment } = await new EnvironmentDeleteLocalAction(config, chosenWorkspace, chosenEnvironment.uid).run()
      this.log(
        `Environment ${pmacEnvironmentName} deleted from .pmac (repository).`,
      )
    } else if (flags['remote-only']) {
      const { deletedEnvironment } = await new EnvironmentDeleteRemoteAction(config, postmanApiInstance, chosenWorkspace, chosenEnvironment.uid).run()
      this.log(
        `Environment ${pmacEnvironmentName} deleted from your PM account (remote).`,
      )
    } else {
      const { deletedEnvironment } = await new EnvironmentDeleteAction(
        config,
        postmanApiInstance,
        chosenWorkspace,
        chosenEnvironment.uid,
      ).run()

      this.log(
        `Environment ${pmacEnvironmentName} deleted from both your PM account (remote) and ${config.PMAC_FOLDER_NAME} (repository).`,
      )
    }
  }
}
