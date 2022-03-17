import { Command, Flags } from '@oclif/core'

import inquirer from 'inquirer'

import { PMACWorkspaceChooseAction, PMACWorkspaceGetAllAction } from '../../postman/actions'
import { postmanApiInstance } from '../../postman/api'
import { fsWorkspaceManager } from '../../file-system'
import { WorkspaceDeleteAction } from '../../postman/actions/workspace-delete.action'
import { PMACWorkspaceDeleteAction } from '../../postman/actions/pmac-workspace-delete.action'
import { PMWorkspaceDeleteAction } from '../../postman/actions/pm-workspace-delete.action'

export default class WorkspaceDelete extends Command {
  static description = 'Deletes PM workspace, default: removes workspace from both .pmac (repository) and PM account (remote).'

  static examples = [
    `$pmac workspace delete
`,
  ]

  static flags = {
    'pm-only': Flags.boolean({ char: 'r', description: 'Removes workspace only from your PM account, keeps workspace in .pmac (repository)', required: false }),
    'pmac-only': Flags.boolean({ char: 'l', description: 'Removes workspace only from .pmac, keeps workspace in your PM account (remote)', required: false }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(WorkspaceDelete)

    const pmacWorkspaces = await new PMACWorkspaceGetAllAction(
      fsWorkspaceManager,
    ).run()

    const chosenPMACWorkspace = await new PMACWorkspaceChooseAction(
      inquirer,
      pmacWorkspaces,
      { customMessage: 'Choose workspace to delete' },
    ).run()

    let deleted
    if (flags['pmac-only']) {
      await new PMACWorkspaceDeleteAction(fsWorkspaceManager, chosenPMACWorkspace).run()
      deleted = chosenPMACWorkspace.pmacID
    } else if (flags['pm-only']) {
      const { deletedPMWorkspaceId } = await new PMWorkspaceDeleteAction(postmanApiInstance, chosenPMACWorkspace).run()
      deleted = deletedPMWorkspaceId
    } else {
      const { deletedPMWorkspaceId } = await new WorkspaceDeleteAction(
        chosenPMACWorkspace,
        fsWorkspaceManager,
        postmanApiInstance,
      ).run()
      deleted = deletedPMWorkspaceId
    }

    this.log(
      `Workspace ${chosenPMACWorkspace.name} id:${deleted} deleted from remote and repository successfully.`,
    )
  }
}
