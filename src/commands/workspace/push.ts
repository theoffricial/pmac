import { Command } from '@oclif/core'

import { PMACWorkspaceChooseAction, PMACWorkspaceGetAllAction, PMWorkspaceFetchAction, PMWorkspacePullToPMACAction } from '../../postman/actions'
import { postmanApiInstance } from '../../postman/api'
import { fsWorkspaceManager, fsWorkspaceResourceManager } from '../../file-system'
import { PostmanWorkspace } from '../../postman/api/types'
import { PMACWorkspace } from '../../file-system/types'
import inquirer from 'inquirer'
import { PMWorkspaceCreateAction } from '../../postman/actions/pm-workspace-create.action'

export default class WorkspaceFetchPulled extends Command {
  static description = 'Fetches all pulled workspaces up-to-date.'

  static examples = [
    `$pmac workspace fetch
`,
  ]

  async run(): Promise<void> {
    await this.parse(WorkspaceFetchPulled)

    const pmacWorkspaces = await new PMACWorkspaceGetAllAction(fsWorkspaceManager).run()

    const pmacWorkspace = await new PMACWorkspaceChooseAction(inquirer, pmacWorkspaces).run()

    await new PMWorkspaceCreateAction(fsWorkspaceManager, fsWorkspaceResourceManager, postmanApiInstance, pmacWorkspace).run()

    this.log(`PMAC Workspace ${pmacWorkspace.name} pushed to PM successfully.`)
    // console.log('All workspaces updated.')
  }
}
