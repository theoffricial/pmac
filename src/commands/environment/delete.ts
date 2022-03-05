import { Command, Flags } from '@oclif/core'

import inquirer from 'inquirer'
import { fsWorkspaceManager, fsWorkspaceResourceManager } from '../../file-system'
import { postmanApiInstance } from '../../postman/api'
import { PMACEnvironmentDeleteAction, PMEnvironmentDeleteAction, PMEnvironmentFetchAllAction, PMEnvironmentMetadataChooseAction, PMACWorkspaceChooseAction, PMACWorkspaceGetAllAction } from '../../postman/actions'

import { EnvironmentDeleteAction } from '../../postman/actions/environment-delete.action'

export default class EnvironmentDelete extends Command {
  static description = 'Deletes PM environment. default: Deletes from both .pmac (repository), and PM account (remote).'

  static examples = [
    `$pmac environment delete
`,
  ]

  static flags = {
    'pm-only': Flags.boolean({ char: 'r', description: 'Removes environment only from your PM account, keeps workspace in .pmac (repository)', required: false }),
    'pmac-only': Flags.boolean({ char: 'l', description: 'Removes environment only from .pmac, keeps workspace in your PM account (remote)', required: false }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(EnvironmentDelete)

    const pmacWorkspaces = await new PMACWorkspaceGetAllAction(fsWorkspaceManager,
    ).run()

    const chosenPMACWorkspace = await new PMACWorkspaceChooseAction(
      inquirer,
      pmacWorkspaces,
    ).run()

    const pmEnvironmentsMetadata = await new PMEnvironmentFetchAllAction(
      postmanApiInstance,
      chosenPMACWorkspace,
    ).run()

    const chosenPMEnvironmentMetadata = await new PMEnvironmentMetadataChooseAction(
      inquirer,
      pmEnvironmentsMetadata,
    ).run()

    // const pmacEnvironmentName = config.resourceNameConvention(chosenEnvironment.name, chosenEnvironment.uid)

    if (flags['pmac-only']) {
      const { deletedPMACID } = await new PMACEnvironmentDeleteAction(fsWorkspaceResourceManager, chosenPMACWorkspace, chosenPMEnvironmentMetadata).run()
      this.log(
        `Environment pmacID:${deletedPMACID} deleted from pmac.`,
      )
    } else if (flags['pm-only']) {
      const { deletedPMEnvironmentUid } = await new PMEnvironmentDeleteAction(fsWorkspaceResourceManager, postmanApiInstance, chosenPMACWorkspace, chosenPMEnvironmentMetadata).run()
      this.log(
        `Environment pmUID:${deletedPMEnvironmentUid} deleted from your PM account.`,
      )
    } else {
      const { deletedPMACID, deletedPMEnvironmentUid } = await new EnvironmentDeleteAction(
        fsWorkspaceResourceManager,
        postmanApiInstance,
        chosenPMACWorkspace,
        chosenPMEnvironmentMetadata,
      ).run()

      this.log(
        `Environment pmacID:${deletedPMACID} pmUID:${deletedPMEnvironmentUid} deleted from both your PM account and pmac.`,
      )
    }
  }
}
