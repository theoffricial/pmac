import { Command, Flags } from '@oclif/core'
import Listr from 'listr'
import { fsMainManager, fsPrivateManager } from '../../file-system'
import { pmakValidator } from '../../validators'

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
      description: `Your PM account api key, .pmac need it to integrate with your PM account, if you have not generated one yet, 
      please generate it at: https://learning.postman.com/docs/developer/intro-api/`,
    }),
    // from: Flags.string({char: 'f', description: 'Whom is saying hello', required: true}),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(PmacInit)
    const tasks = new Listr([
      {
        title: 'Validating api key',
        task: (_ctx, _task) => {
          const apiKey = flags['api-key']
          const validApiKey = pmakValidator(apiKey)

          if (!validApiKey) {
            this.error('Invalid PMAK')
          }
        },
      },
      {
        title: 'Initial .pmac environment',
        task: async  (ctx, _task) => {
          await fsMainManager.init({ overwrite: true })
          ctx.apiKey = flags['api-key']
          // this.log('.pmac environment initial successfully!')
        },
      },
      {
        title: 'Set your api key in .pmac',
        enabled: ctx => ctx.apiKey,
        task: async ctx => {
          await fsPrivateManager.createPMACPrivateConfig({ apiKey: ctx.apiKey })
          // this.log('.pmac set your api key, it is important to integrate with postman API.')
        },
      },
    ], { concurrent: false })

    await tasks.run()
    // config.init({ force: true })
    // if (args.apiKey) {
    //   config.saveApiKey(args.apiKey)
    // }
  }
}
