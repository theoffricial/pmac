import { Command, Flags } from '@oclif/core'

import inquirer from 'inquirer'
import { PmacConfigurationManager } from '../../file-system'
import { postmanApiInstance } from '../../postman/api'
import { CollectionFetchAllAction, CollectionMetadataChooseAction, WorkspaceChooseAction, WorkspaceGetAllLocalAction } from '../../postman/actions'
import { CollectionDeleteAction } from '../../postman/actions/collection-delete.action'
import { CollectionDeleteLocalAction } from '../../postman/actions/collection-delete-local.action'
import { CollectionDeleteRemoteAction } from '../../postman/actions/collection-delete-remote.action'

export default class CollectionDelete extends Command {
  static description = 'Deletes PM collection. default: Deletes from both .pmac (repository), and PM account (remote).'

  static examples = [
    `$pmac collection delete
`,
  ]

  static flags = {
    'remote-only': Flags.boolean({ char: 'r', description: 'Removes collection only from your PM account, keeps workspace in .pmac (repository)', required: false }),
    'local-only': Flags.boolean({ char: 'l', description: 'Removes collection only from .pmac, keeps workspace in your PM account (remote)', required: false }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(CollectionDelete)

    const config = new PmacConfigurationManager()

    const { localWorkspaces } = await new WorkspaceGetAllLocalAction(
      config,
    ).run()

    const { chosenWorkspace } = await new WorkspaceChooseAction(
      inquirer,
      localWorkspaces,
    ).run()

    const { collectionsMetadata } = await new CollectionFetchAllAction(
      postmanApiInstance,
      chosenWorkspace,
    ).run()

    const { chosenCollection } = await new CollectionMetadataChooseAction(
      inquirer,
      collectionsMetadata,
    ).run()

    if (flags['local-only']) {
      const { deletedCollection } = await new CollectionDeleteLocalAction(config, chosenWorkspace, chosenCollection.uid).run()
      this.log(
        `Collection ${chosenCollection.name} [uid: ${chosenCollection.uid}] deleted from .pmac (repository).`,
      )
    } else if (flags['remote-only']) {
      const { deletedCollection } = await new CollectionDeleteRemoteAction(config, postmanApiInstance, chosenWorkspace, chosenCollection.uid).run()
      this.log(
        `Collection ${chosenCollection.name} [uid: ${chosenCollection.uid}] deleted from your PM account (remote).`,
      )
    } else {
      const { deletedCollection } = await new CollectionDeleteAction(
        config,
        postmanApiInstance,
        chosenWorkspace,
        chosenCollection.uid,
      ).run()

      this.log(
        `Collection ${chosenCollection.name} [uid: ${chosenCollection.uid}] deleted from both your PM account (remote) and .pmac (repository).`,
      )
    }
  }
}
