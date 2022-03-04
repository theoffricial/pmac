import { Command } from '@oclif/core'
import { fsPrivateManager } from '../../file-system'

export default class ApiKeyUpdate extends Command {
  static description = 'Update your PM api key'

  static examples = [
    `$pmac pm api-key-update <your-pm-api-key>
`,
  ]

    static args = [{ name: 'apiKey', description: 'Postman api key', required: true }]

    async run(): Promise<void> {
      const { args } = await this.parse(ApiKeyUpdate)

      this.log('\nArgs:', args.apiKey)
      const privateJson = await fsPrivateManager.getPrivateConfig()
      await fsPrivateManager.createPMACPrivateConfig({ ...privateJson, apiKey: args.apiKey })

      this.log(
        '.pmac api key updated successfully.',
      )
    }
}
