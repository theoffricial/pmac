import { Command } from '@oclif/core'

import { fsWorkspaceManager, fsWorkspaceResourceManager } from '../../file-system'
import inquirer from 'inquirer'
import { postmanApiInstance } from '../../postman/api'
import { EnvironmentChooseAction, PMACEnvironmentGetAllAction, EnvironmentGetMetadataAction, PMACWorkspaceChooseAction, EnvironmentPushAction, PMACWorkspaceGetAllAction } from '../../postman/actions'

export default class EnvironmentPush extends Command {
  static description = 'Pushes (Fetches) environment updates to your PM account (remote) from your .pmac (repository).'

  static examples = [
    `$pmac environment push
`,
  ]

  static flags = {
    // eslint-disable-next-line no-warning-comments
    // TODO: Make environment flag work.
    // environment: Flags.string({
    //   char: 'c',
    //   description: 'Path to your environment JSON definition.',
    //   helpValue: './path/to/your/environment-definition.json',
    //   required: false,
    // }),
  }

  async run(): Promise<void> {
    await this.parse(EnvironmentPush)
    const pmacWorkspaces = await new PMACWorkspaceGetAllAction(
      fsWorkspaceManager,
    ).run()

    const chosenPMACWorkspace = await new PMACWorkspaceChooseAction(
      inquirer,
      pmacWorkspaces,
    ).run()

    const pmacEnvironments = await new PMACEnvironmentGetAllAction(
      fsWorkspaceResourceManager,
      chosenPMACWorkspace,
    ).run()

    if (pmacEnvironments.length === 0) {
      this.error('No environments found', { exit: 1 })
    }

    const pmacEnvironment = await new EnvironmentChooseAction(
      inquirer,
      pmacEnvironments,
    ).run()

    const environmentPMACMap = await new EnvironmentGetMetadataAction(chosenPMACWorkspace, pmacEnvironment).run()

    // if (!environmentPMACMap) {
    //   this.error('Environment not found', { exit: 1 })
    // } else if (!environmentPMACMap.pmUID) {
    //   this.error('PMAC Environment found, but was lacking the pmUID required to push the environment to PM.')
    // }
    const pmEnvironmentUid = environmentPMACMap?.pmUID || ''
    const pmEnvironmentMetadata = await new EnvironmentPushAction(
      fsWorkspaceManager,
      fsWorkspaceResourceManager,
      postmanApiInstance,
      chosenPMACWorkspace,
      pmacEnvironment,
    ).run()

    this.log(`Environment '${pmEnvironmentMetadata.name} uid:${pmEnvironmentMetadata.uid}' updated`)
  }
}
