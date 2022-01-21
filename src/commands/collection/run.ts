import { Command, Flags } from '@oclif/core'
import inquirer from 'inquirer'
import { PmacConfigurationManager } from '../../file-system'
import { CollectionChooseAction, CollectionGetAllLocalAction, EnvironmentChooseAction, WorkspaceChooseAction, WorkspaceGetAllLocalAction } from '../../postman/actions'
import { EnvironmentGetAllLocalAction } from '../../postman/actions/environment-get-all-local.action'
import newman from 'newman'

export default class CollectionRun extends Command {
  static description = 'Runs PM collection'

  static examples = [
    `$pmac collection run
`,
  ]

  static flags = {
    'iteration-count': Flags.integer({
      char: 'n',
      description: 'Number of iteration to run collection, default: 1',
      required: false,
      default: 1,
    }),
    environment: Flags.string({
      char: 'e',
      description: 'Relative path to your .pmac environment defined JSON',
      required: false,
      default: '',
    }),
    collection: Flags.string({
      char: 'c',
      description: 'Relative path to your .pmac collection defined JSON',
      required: false,
      default: '',
    }),
    reporters: Flags.string({
      char: 'r',
      description: 'Comma separated reports types, options: cli,html,csv',
      options: ['cli', 'html', 'csv'],
      required: false,
      default: 'cli,html',
    }),
  }

  // static args = [{ name: 'apiKey', description: 'Postman api key', required: false }]

  async run(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { flags } = await this.parse(CollectionRun)

    const config = new PmacConfigurationManager()

    const { localWorkspaces } = await new WorkspaceGetAllLocalAction(
      config,
    ).run()

    const { chosenWorkspace } = await new WorkspaceChooseAction(
      inquirer,
      localWorkspaces,
    ).run()

    const { localCollections } = await new CollectionGetAllLocalAction(
      config,
      chosenWorkspace,
    ).run()

    if (localCollections.length === 0) {
      throw new Error(
        `No collections found for workspace '${chosenWorkspace.name}'`,
      )
    }

    const { chosenCollection } = await new CollectionChooseAction(
      inquirer,
      localCollections,
    ).run()

    // if (!commandAndOptions.environment) {
    const { localEnvironments } = await new EnvironmentGetAllLocalAction(
      config,
      chosenWorkspace,
    ).run()

    const { chosenEnvironment } = await new EnvironmentChooseAction(inquirer, [
      ...localEnvironments,
    // skip option
    { name: '[skip]', id: '' } as any,
    ]).run()

    // TODO: function that calculates reports
    const reporters = {}

    newman.run({
      collection: flags?.collection || chosenCollection,
      environment: flags?.environment || chosenEnvironment || '',
      iterationCount: Number(flags['iteration-count'] || 1),
      reporters: flags?.reporters?.replace('html', 'htmlextra').split(',') || [
        'cli',
        'htmlextra',
        // 'csv',
        // 'html',
        // 'confluence',
      ],
      reporter: {
        cli: {
          noBanner: true,
        },
        // See: https://github.com/DannyDainton/newman-reporter-htmlextra#with-newman-as-a-library
        htmlextra: {
          export: './pmac-newman-reports/htmlextra-report.html',
          title: 'execution-report',
          browserTitle: 'Pmac report',
        },
      // See: https://github.com/matt-ball/newman-reporter-csv#about
      // csv: {
      //   export: "./newman/csv-report.csv",
      // },
      // See: https://github.com/OmbraDiFenice/newman-reporter-confluence#with-newman-as-a-library
      // confluence: {
      //   export: "./newman/default-template.wiki",
      //   template: "./templates/confluence/confluence.hbs", // optional, this will be picked up relative to the directory that Newman runs in.
      // },
      },
    } as any)

    // this.log('.pmac environment initial successfully!')
  }
}
