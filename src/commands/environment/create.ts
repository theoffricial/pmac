import { Command, Flags } from '@oclif/core'

import { PmacConfigurationManager } from '../../file-system'

import inquirer from 'inquirer'
import { postmanApiInstance } from '../../postman/api'
import { EnterNameAction, WorkspaceChooseAction, WorkspaceGetAllLocalAction } from '../../postman/actions'
import { EnvironmentPushNewAction } from '../../postman/actions/environment-push-new.action'
import { PostmanEnvironment } from '../../postman/api/types'

export default class EnvironmentCreate extends Command {
  static description = 'Creates a new PM environment.'

  static examples = [
    `$pmac environment create 
`,
  ]

  static flags = {}

  async run(): Promise<void> {
    const { flags } = await this.parse(EnvironmentCreate)

    const config = new PmacConfigurationManager()

    const { localWorkspaces } = await new WorkspaceGetAllLocalAction(
      config,
    ).run()

    const { chosenWorkspace } = await new WorkspaceChooseAction(
      inquirer,
      localWorkspaces,
    ).run()

    const { chosenName } = await new EnterNameAction(
      inquirer,
      'Enter a name for the new PM environment',
    ).run()
    const newEnvironment: Pick<PostmanEnvironment, 'name' | 'values'> = {
      name: chosenName,
      values: [
        {
          enabled: true,
          key: 'exampleVariable',
          value: '42',
        },
      ],
    }

    const { environment } = await new EnvironmentPushNewAction(
      config,
      postmanApiInstance,
      chosenWorkspace,
      newEnvironment,
    ).run()

    this.log(
      `Environment ${environment.name} [id: ${environment.id}] created successfully.`,
    )
  }
}
