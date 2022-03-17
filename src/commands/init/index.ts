import { Command, Flags } from '@oclif/core'
import { Listr } from 'listr2'
import { PmacInitCtx, pmacInitCommandHelper } from '../../commands-helpers/init/init.helper'
import { PMAC_FILE_SYS } from '../../file-system'

const introToPMApi = 'https://learning.postman.com/docs/developer/intro-api/'

export default class PmacInit extends Command {
  static description = 'Initial pmac environment'

  static examples = [
    `$pmac init --api-key "your-pm-api-key"
`,
    `$pmac init -k "your-pm-api-key"
`,
  ]

  static flags = {
    'api-key': Flags.string({
      char: 'k',
      default: '',
      required: true,
      description: `Postman api key, .pmac need it to integrate with your PM account, if you have not generated one yet, 
      please generate it at: ${introToPMApi}`,
    }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(PmacInit)

    const tasks = new Listr<PmacInitCtx>(
      [
        {
          title: 'Initial pmac in your project..',
          task: (_ctx, task): Listr<PmacInitCtx> =>
            task.newListr([
              {
                title: 'Validating Postman api key',
                task: pmacInitCommandHelper.postmanApiKeyValidation,
              },
              {
                title: 'Initial pmac file system',
                task: pmacInitCommandHelper.pmacFileSystemInitTask,
              },
              {
                title: `Saving your api key in pmac private json at ${PMAC_FILE_SYS.MAIN_DIR.PRIVATE_DIR.CONFIG_FILE.path}`,
                task: pmacInitCommandHelper.savePostmanApiKeyInPrivateTask,
              },
            ]),
        },

      ], {
        concurrent: false,
        rendererOptions: { showSubtasks: true, collapse: false, showTimer: true  },
      })

    await tasks.run({
      apiKey: flags['api-key'],
    })
  }
}
