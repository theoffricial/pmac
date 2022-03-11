import { Command, Flags } from '@oclif/core'

import inquirer from 'inquirer'
import { fsWorkspaceManager, fsWorkspaceResourceManager } from '../../file-system'
import { postmanApiInstance } from '../../postman/api'
import { PMACEnvironmentDeleteAction, PMEnvironmentDeleteAction, PMEnvironmentFetchAllAction, PMEnvironmentMetadataChooseAction, PMACWorkspaceChooseAction, PMACWorkspaceGetAllAction, EnvironmentChooseAction, PMACEnvironmentGetPMACMapAction } from '../../postman/actions'

import { EnvironmentDeleteAction } from '../../postman/actions/environment-delete.action'
import { WorkspaceResource } from '../../postman/api/types'

export default class EnvironmentDelete extends Command {
  static description = 'Deletes PM environment. default: Deletes from both .pmac (repository), and PM account (remote).'

  static examples = [
    '$pmac environment delete',
    '$pmac environment delete --pm-only',
    '$pmac environment delete --pmac-only',
  ]

  static flags = {
    'pm-only': Flags.boolean({ char: 'r', description: 'Removes environment only from your PM account, keeps workspace in .pmac (repository)', required: false }),
    'pmac-only': Flags.boolean({ char: 'l', description: 'Removes environment only from .pmac, keeps workspace in your PM account (remote)', required: false }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(EnvironmentDelete)

    const pmacWorkspaces = await new PMACWorkspaceGetAllAction(
      fsWorkspaceManager,
    ).run()

    const pmacWorkspace = await new PMACWorkspaceChooseAction(
      inquirer,
      pmacWorkspaces,
    ).run()

    const pmacEnvironments = await fsWorkspaceResourceManager.getAllPMACWorkspaceResourcesByPattern(
      pmacWorkspace,
      WorkspaceResource.Environment,
      '*')

    const pmacEnvironment = await new EnvironmentChooseAction(inquirer, pmacEnvironments).run()

    const pmacMap = await new PMACEnvironmentGetPMACMapAction(pmacWorkspace, pmacEnvironment).run()

    if (!pmacMap) {
      this.error('pmacID not found for the requested environment')
    }

    if (flags['pmac-only']) {
      await new PMACEnvironmentDeleteAction(fsWorkspaceResourceManager, {
        name: pmacEnvironment.name,
        type: WorkspaceResource.Environment,
        pmacID: pmacMap.pmacID,
        workspaceName: pmacWorkspace.name,
        workspaceType: pmacWorkspace.type,
        workspacePMACId: pmacWorkspace.pmacID,
      }).run()
      this.log(
        `${WorkspaceResource.Environment} ${pmacEnvironment.name} deleted from pmac.`,
      )
      return
    }

    if (!pmacMap.pmUID) {
      this.error(`${WorkspaceResource.Environment} pmUID not found, you can check your pmac-workspace.json`)
    }

    if (flags['pm-only']) {
      await new PMEnvironmentDeleteAction(
        fsWorkspaceResourceManager,
        postmanApiInstance,
        pmacWorkspace,
        {
          id: pmacMap.pmID || '',
          uid: pmacMap.pmUID,
          name: pmacEnvironment.name,
          owner: pmacEnvironment.owner,
        }).run()

      this.log(
        `${WorkspaceResource.Environment} '${pmacEnvironment.name}' deleted from your Postman account.`,
      )
      return
    }

    await new EnvironmentDeleteAction(
      fsWorkspaceResourceManager,
      postmanApiInstance,
      pmacWorkspace,
      pmacEnvironment,
    ).run()

    this.log(
      `${WorkspaceResource.Environment} '${pmacEnvironment.name}' deleted from both your Postman account and pmac.`,
    )
  }
}

