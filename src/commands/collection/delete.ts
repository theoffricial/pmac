import { Command, Flags } from '@oclif/core'

import inquirer from 'inquirer'
import { fsWorkspaceManager, fsWorkspaceResourceManager } from '../../file-system'
import { postmanApiInstance } from '../../postman/api'
import { PMACWorkspaceChooseAction, PMACWorkspaceGetAllAction, CollectionChooseAction, CollectionDeleteAction } from '../../postman/actions'
import { PMACCollectionDeleteAction } from '../../postman/actions/pmac-collection-delete.action'
import { PMCollectionDeleteAction } from '../../postman/actions/pm-collection-delete.action'
import { WorkspaceResource } from '../../postman/api/types'

export default class CollectionDelete extends Command {
  static description = 'Deletes PM collection. default: Deletes from both .pmac (repository), and PM account (remote).'

  static examples = [
    `$pmac collection delete
`,
  ]

  static flags = {
    'pm-only': Flags.boolean({ char: 'r', description: 'Removes collection only from your PM account, keeps workspace in .pmac (repository)', required: false }),
    'pmac-only': Flags.boolean({ char: 'l', description: 'Removes collection only from .pmac, keeps workspace in your PM account (remote)', required: false }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(CollectionDelete)

    const pmacWorkspaces = await new PMACWorkspaceGetAllAction(
      fsWorkspaceManager,
    ).run()

    const pmacWorkspace = await new PMACWorkspaceChooseAction(
      inquirer,
      pmacWorkspaces,
    ).run()

    const pmacCollections = await fsWorkspaceResourceManager.getAllPMACWorkspaceResourcesByPattern(
      pmacWorkspace,
      WorkspaceResource.Collection,
      '*')

    const pmacCollection = await new CollectionChooseAction(inquirer, pmacCollections).run()

    const pmacMap = pmacWorkspace.collections.find(pmacC => pmacC.pmID === pmacCollection.info._postman_id)

    if (!pmacMap) {
      this.error('pmacID not found for the requested collection', { code: '0' })
    }

    if (flags['pmac-only']) {
      await new PMACCollectionDeleteAction(fsWorkspaceResourceManager, {
        name: pmacCollection.info.name,
        type: WorkspaceResource.Collection,
        pmacID: pmacMap.pmacID,
        workspaceName: pmacWorkspace.name,
        workspaceType: pmacWorkspace.type,
        workspacePMACId: pmacWorkspace.pmacID,
      }).run()
      this.log(
        `Collection ${pmacCollection.info.name} deleted from pmac.`,
      )
      return
    }

    if (!pmacMap.pmUID) {
      this.error('Collection pmUID not found, you can check your pmac-workspace.json')
    }

    if (flags['pm-only']) {
      await new PMCollectionDeleteAction(
        fsWorkspaceResourceManager,
        postmanApiInstance,
        pmacWorkspace,
        {
          id: pmacCollection.info._postman_id,
          name: pmacCollection.info.name,
          uid: pmacMap.pmUID || '',
        }).run()

      this.log(
        `Collection ${pmacCollection.info.name} deleted from your Postman account.`,
      )
      return
    }

    await new CollectionDeleteAction(
      fsWorkspaceResourceManager,
      postmanApiInstance,
      pmacWorkspace,
      pmacCollection,
    ).run()
    this.log(
      `Collection ${pmacCollection.info.name} pmacID:${pmacMap.pmacID} deleted from .pmac.`,
    )
  }
}
