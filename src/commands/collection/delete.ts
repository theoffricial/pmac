import { Command, Flags } from '@oclif/core'

import inquirer from 'inquirer'
import { fsWorkspaceManager, fsWorkspaceResourceManager } from '../../file-system'
import { postmanApiInstance } from '../../postman/api'
import { PMACWorkspaceChooseAction, PMACWorkspaceGetAllAction, CollectionChooseAction } from '../../postman/actions'
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

    const existingCollections = new Set(pmacWorkspace.collections.map(c => c.pmID))

    const filtered = pmacCollections.filter(pmC =>
      existingCollections.has(pmC.info._postman_id),
    )

    const pmacCollection = await new CollectionChooseAction(inquirer, filtered).run()

    const pmacMap = pmacWorkspace.collections.find(pmacC => pmacC.pmID === pmacCollection.info._postman_id)

    if (!pmacMap) {
      this.error('pmacID not found for the requested collection')
    }

    // if (!flags['pmac-only']) {
    if (!pmacMap.pmUID) {
      this.error('Collection pmUID not found')
    }

    await new PMCollectionDeleteAction(
      fsWorkspaceResourceManager,
      postmanApiInstance,
      pmacWorkspace,
      {
        id: pmacCollection.info._postman_id,
        name: pmacCollection.info.name,
        uid: pmacMap.pmUID,
      }).run()

    this.log(
      `Collection ${pmacCollection.info.name} deleted from your PM account.`,
    )
    // }
    // if (!flags['pm-only']) {
    await new PMACCollectionDeleteAction({
      name: pmacCollection.info.name,
      type: WorkspaceResource.Collection,
      pmacID: pmacMap.pmacID,
      workspaceName: pmacWorkspace.name,
      workspaceType: pmacWorkspace.type,
      workspacePMACId: pmacWorkspace.pmacID,
    }).run()

    this.log(
      `Collection ${pmacCollection.info.name} pmacID:${pmacMap.pmacID} deleted from .pmac.`,
    )
    // }

    // const pmCollectionsMetadata = await new PMCollectionFetchAllAction(
    //   postmanApiInstance,
    //   pmacWorkspace,
    // ).run()

    // const pmCollectionMetadata = await new PMCollectionMetadataChooseAction(
    //   inquirer,
    //   pmCollectionsMetadata,
    // ).run()

    // else {
    //   await new CollectionDeleteAction(
    //     config,
    //     postmanApiInstance,
    //     pmacWorkspace,
    //     chosenCollection.uid,
    //   ).run()

    //   this.log(
    //     `Collection ${pmacCollectionName} deleted from both your PM account (remote) and .pmac (repository).`,
    //   )
    // }
  }
}
