import { Command, Flags } from '@oclif/core'

import inquirer from 'inquirer'

import { PMACWorkspaceCreateAction } from '../../postman/actions'
import { fsWorkspaceManager } from '../../file-system'

export default class WorkspaceCreate extends Command {
  static description = 'Creates new PMAC collection'

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

    const pmacNewWorkspace = await new PMACWorkspaceCreateAction(
      fsWorkspaceManager,
      inquirer,
    ).run()

    this.log(
      `Workspace ${pmacNewWorkspace.name} pmacID:${pmacNewWorkspace.pmacID} created successfully.`,
    )
  }
}
