import { Command } from '@oclif/core'

import inquirer from 'inquirer'
import { postmanApiInstance } from '../../postman/api'
import { CollectionChooseAction, CollectionPushAction, PMACCollectionGetAllAction, PMACWorkspaceChooseAction } from '../../postman/actions'
import { PMACCollectionGetPMACMapAction } from '../../postman/actions/pmac-collection-get-map.action'
import { fsWorkspaceManager, fsWorkspaceResourceManager } from '../../file-system'

export default class CollectionPush extends Command {
  static description = 'Pulls (Fetches) new updates about an existing collection on your .pmac (repository).'

  static examples = [
    `$pmac collection pull
`,
  ]

  static flags = {
    // eslint-disable-next-line no-warning-comments
    // TODO: Make collection flag work.
    // collection: Flags.string({
    //   char: 'c',
    //   description: 'Path to your collection JSON definition.',
    //   helpValue: './path/to/your/collection-definition.json',
    //   required: false,
    // }),
  }

  async run(): Promise<void> {
    await this.parse(CollectionPush)

    const pmacWorkspaces = await fsWorkspaceManager.getAllPMACWorkspaces()

    const pmacWorkspace = await new PMACWorkspaceChooseAction(
      inquirer,
      pmacWorkspaces,
    ).run()

    const pmacCollections = await new PMACCollectionGetAllAction(
      fsWorkspaceResourceManager,
      pmacWorkspace,
    ).run()

    if (pmacCollections.length === 0) {
      this.error('No collections found', {
        exit: 1,
        message: 'No .pmac collections found.',
        suggestions: ['Try to pull workspace, e.g.pmac workspace pull', 'Try to create a new collection'],
      })
    }

    const pmacCollection = await new CollectionChooseAction(
      inquirer,
      pmacCollections,
    ).run()

    const collectionPMACMap = await new PMACCollectionGetPMACMapAction(pmacWorkspace, pmacCollection).run()

    // if (!collectionPMACMap) {
    //   this.error('pmac collection not found', { exit: 1 })
    // } else if (!collectionPMACMap.pmUID) {
    //   this.error('pmac collection found, but was lacking the pmUID required to push the collection to PM.')
    // }

    const pmCollectionUid = collectionPMACMap?.pmUID || ''

    const pmCollectionMetadata = await new CollectionPushAction(
      fsWorkspaceManager,
      fsWorkspaceResourceManager,
      postmanApiInstance,
      pmacWorkspace,
      pmCollectionUid,
      pmacCollection,
    ).run()

    this.log(`Collection '${pmacCollection.info?.name} uid:${pmCollectionMetadata.uid}' pushed from pmac to your Postman account successfully.`)
  }
}
