import { Command, Flags } from '@oclif/core'

import inquirer from 'inquirer'

import { WorkspaceChooseAction, WorkspaceGetAllLocalAction, WorkspacePushNewAction } from '../../postman/actions'
import { postmanApiInstance } from '../../postman/api'
import { PmacConfigurationManager } from '../../file-system'
import { WorkspaceDeleteAction } from '../../postman/actions/workspace-delete.action'
import { WorkspaceDeleteLocalAction } from '../../postman/actions/workspace-delete-local.action'
import { WorkspaceDeleteRemoteAction } from '../../postman/actions/workspace-delete-remote.action'

export default class WorkspaceDelete extends Command {
  static description = 'Deletes PM workspace, default: removes workspace from both .pmac (repository) and PM account (remote).'

  static examples = [
    `$pmac workspace delete
`,
  ]

  static flags = {
    'remote-only': Flags.boolean({ char: 'r', description: 'Removes workspace only from your PM account, keeps workspace in .pmac (repository)', required: false }),
    'local-only': Flags.boolean({ char: 'l', description: 'Removes workspace only from .pmac, keeps workspace in your PM account (remote)', required: false }),
  }

  async run(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { flags } = await this.parse(WorkspaceDelete)

    const config = new PmacConfigurationManager()

    const { localWorkspaces } = await new WorkspaceGetAllLocalAction(
      config,
    ).run()

    const { chosenWorkspace } = await new WorkspaceChooseAction(
      inquirer,
      localWorkspaces,
      { customMessage: 'Choose workspace to delete' },
    ).run()

    let deleted
    if (flags['local-only']) {
      const { deletedWorkspace } = await new WorkspaceDeleteLocalAction(config, chosenWorkspace).run()
      deleted = deletedWorkspace
    } else if (flags['remote-only']) {
      const { deletedWorkspace } = await new WorkspaceDeleteRemoteAction(postmanApiInstance, chosenWorkspace).run()
      deleted = deletedWorkspace
    } else {
      const { deletedWorkspace } = await new WorkspaceDeleteAction(
        config,
        postmanApiInstance,
        chosenWorkspace,
      ).run()
      deleted = deletedWorkspace
    }

    this.log(
      `Environment ${chosenWorkspace.name} deleted from remote and repository successfully.`,
    )
  }
}

export async function workspacePushNewCommand(
//     commandAndOptions: {
//   apiKey?: string;
// }
): Promise<void> {
//   let headers = {}
//   if (commandAndOptions.apiKey) {
//     headers = {
//       'X-Api-Key': commandAndOptions.apiKey,
//     }
//   }

  const config = new PmacConfigurationManager()

  const { newWorkspace } = await new WorkspacePushNewAction(
    inquirer,
    config,
    postmanApiInstance,
  ).run()

  const pmacName = config.resourceNameConvention(newWorkspace.name, newWorkspace.id)
  console.log(
    `Workspace ${pmacName} created for both postman account and repository successfully.`,
  )
}
