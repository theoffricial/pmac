import { Command } from '@oclif/core'
import { PmacConfigurationManager } from '../../file-system'

export default class ApiKeyDelete extends Command {
  static description = 'Update your PM api key'

  static examples = [
    `$pmac pm api-key-update <your-pm-api-key>
`,
  ]

  //   static flags = {
  //     'api-key': Flags.string({ char: 'k', description: 'Dynamic api key', required: false, helpValue: '<your PM api key>' }),
  //   }

  // static args = [{ name: 'apiKey', description: 'Postman api key', required: true }]

  async run(): Promise<void> {
    const { args } = await this.parse(ApiKeyDelete)

    const config = new PmacConfigurationManager()

    // this.log('\nArgs:', args.apiKey)
    config.saveApiKey(args.apiKey)

    this.log(
      '.pmac api key deleted successfully.',
    )
  }
}
