import { Command } from '@oclif/core'

import { PMACWorkspaceChooseAction, PMACWorkspaceGetAllAction } from '../../postman/actions'
import { postmanApiInstance } from '../../postman/api'
import { fsWorkspaceManager, fsWorkspaceResourceManager } from '../../file-system'
import inquirer from 'inquirer'
import { PMWorkspaceCreateAction } from '../../postman/actions/pm-workspace-create.action'

export default class WorkspacePush extends Command {
  static description = 'Fetches all pulled workspaces up-to-date.'

  static examples = [
    `$pmac workspace fetch
`,
  ]

  async run(): Promise<void> {
    await this.parse(WorkspacePush)

    const pmacWorkspaces = await new PMACWorkspaceGetAllAction(fsWorkspaceManager).run()

    const pmacWorkspace = await new PMACWorkspaceChooseAction(inquirer, pmacWorkspaces).run()

    if (pmacWorkspace.pmacID) {
      this.error(`Workspace '${pmacWorkspace.name}' already created in your Postman account.`)
    }

    await new PMWorkspaceCreateAction(fsWorkspaceManager, fsWorkspaceResourceManager, postmanApiInstance, pmacWorkspace).run()

    this.log(`PMAC Workspace ${pmacWorkspace.name} pushed to PM successfully.`)
    // console.log('All workspaces updated.')
  }
}
