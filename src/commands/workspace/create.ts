import { Command, Flags } from '@oclif/core'

import inquirer from 'inquirer'

import { WorkspacePushNewAction } from '../../postman/actions'
import { postmanApiInstance } from '../../postman/api'
import { PmacConfigurationManager } from '../../file-system'

export default class WorkspaceCreate extends Command {
  static description = 'Creates new PM collection'

  static examples = [
    `$pmac collection create
`,
  ]

  static flags = {
    'api-key': Flags.string({ char: 'k', description: 'Dynamic api key', required: false, helpValue: '<your PM api key>' }),
  }

  //   static args = [{ name: 'apiKey', description: 'Postman api key', required: false }]

  async run(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { args, flags } = await this.parse(WorkspaceCreate)

    const config = new PmacConfigurationManager()

    const { newWorkspace } = await new WorkspacePushNewAction(
      inquirer,
      config,
      postmanApiInstance,
    ).run()

    const pmacName = config.workspaceNameConvention(newWorkspace.name, newWorkspace.id)
    console.log(
      `Workspace ${pmacName} created for both postman account and repository successfully.`,
    )

    // this.log('.pmac environment initial successfully!')
  }
}
