import { Command, Flags } from '@oclif/core'

import { fsWorkspaceManager, fsWorkspaceResourceManager } from '../../file-system'

import inquirer from 'inquirer'
import { EnvironmentChooseAction, PMACEnvironmentGetAllAction, PMACEnvironmentUpdateAction, PMACWorkspaceChooseAction, PMACWorkspaceGetAllAction } from '../../postman/actions'
import { buildPMACEnvironmentValues } from '../../commands-helpers/environment/environment-commands-shared.helper'
import { PostmanEnvironment } from '../../postman/api/types'

export default class EnvironmentCreate extends Command {
  static description = 'Creates a new PM environment.'

  static examples = [
    `$pmac environment create 
`,
  ]

  static flags = {
    dotEnvPath: Flags.string({
      char: 'e',
      helpValue: 'my/custom/path/to/.env',
      description: 'Specify a relative path to a .env file, to copy values to, [Do not take .env as default!]',
      required: true,
    }),
    // overwrite: Flags.boolean({
    //   default: true,
    //   char: 'o',
    //   required: false,
    // }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(EnvironmentCreate)

    const pmacWorkspaces = await new PMACWorkspaceGetAllAction(
      fsWorkspaceManager,
    ).run()

    const pmacWorkspace = await new PMACWorkspaceChooseAction(
      inquirer,
      pmacWorkspaces,
    ).run()

    const pmacEnvironments = await new PMACEnvironmentGetAllAction(
      fsWorkspaceResourceManager,
      pmacWorkspace,
    ).run()

    if (pmacEnvironments.length === 0) {
      this.error('No environments found', { exit: 1 })
    }

    const pmacEnvironment = await new EnvironmentChooseAction(
      inquirer,
      pmacEnvironments,
    ).run()

    const newPMEnvironment: PostmanEnvironment = {
      ...pmacEnvironment,
      values: buildPMACEnvironmentValues(flags.dotEnvPath),
    }

    // TODO: support without overwrite

    await new PMACEnvironmentUpdateAction(
      fsWorkspaceManager,
      fsWorkspaceResourceManager,
      pmacWorkspace,
      newPMEnvironment,
    ).run()

    this.log(
      `Environment ${newPMEnvironment.name} created successfully.`,
    )
  }
}
