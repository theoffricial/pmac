import { Command } from '@oclif/core'

import { fsWorkspaceManager, fsWorkspaceResourceManager } from '../../file-system'

import inquirer from 'inquirer'
import { postmanApiInstance } from '../../postman/api'
import { EnterNameAction, PMACWorkspaceChooseAction, PMACWorkspaceGetAllAction } from '../../postman/actions'
import { PMACEnvironmentCreateAction } from '../../postman/actions/pmac-environment-create.action'
import { PostmanEnvironment } from '../../postman/api/types'

export default class EnvironmentCreate extends Command {
  static description = 'Creates a new PM environment.'

  static examples = [
    `$pmac environment create 
`,
  ]

  static flags = {}

  async run(): Promise<void> {
    await this.parse(EnvironmentCreate)

    const pmacWorkspaces = await new PMACWorkspaceGetAllAction(
      fsWorkspaceManager,
    ).run()

    const pmacWorkspace = await new PMACWorkspaceChooseAction(
      inquirer,
      pmacWorkspaces,
    ).run()

    const { chosenName } = await new EnterNameAction(
      inquirer,
      'Enter a name for the new PM environment',
    ).run()
    const newPMEnvironment: Pick<PostmanEnvironment, 'name' | 'values'> = {
      name: chosenName,
      values: [
        {
          enabled: true,
          key: 'exampleVariable',
          value: '42',
          type: 'text',
        },
      ],
    }

    const pmEnvironment = await new PMACEnvironmentCreateAction(
      fsWorkspaceManager,
      fsWorkspaceResourceManager,
      postmanApiInstance,
      pmacWorkspace,
      newPMEnvironment,
    ).run()

    this.log(
      `Environment ${newPMEnvironment.name} created successfully.`,
    )
  }
}
