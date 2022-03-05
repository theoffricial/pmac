import { Command } from '@oclif/core'
import { fsPrivateManager } from '../../file-system'

export default class ApiKeyDelete extends Command {
  static description = 'Update your PM api key'

  static examples = [
    `$pmac pm api-key-update <your-pm-api-key>
`,
  ]

  //   static flags = {
  //     'api-key': Flags.string({ char: 'k', description: 'Dynamic api key', required: false, helpValue: '<your PM api key>' }),
  //   }

  async run(): Promise<void> {
    // this.log('\nArgs:', args.apiKey)
    const { apiKey, ...rest } = await fsPrivateManager.getPrivateConfig()
    await fsPrivateManager.createPMACPrivateConfig({ ...rest })

    this.log(
      '.pmac api key deleted successfully.',
    )
  }
}
