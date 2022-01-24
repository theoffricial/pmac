import { Command, Flags } from '@oclif/core'
import inquirer from 'inquirer'
import { PmacConfigurationManager } from '../../file-system'
import { CollectionChooseAction, CollectionGetAllLocalAction, EnvironmentChooseAction, WorkspaceChooseAction, WorkspaceGetAllLocalAction } from '../../postman/actions'
import { EnvironmentGetAllLocalAction } from '../../postman/actions/environment-get-all-local.action'
import newman from 'newman'
import { collectionPathValidator, environmentPathValidator } from '../../validators'
import { PostmanEnvironment } from '../../postman/api/types'
import { PostmanCollection } from '../../postman/api/types/collection.types'

export default class CollectionRun extends Command {
  static description = 'Initiate a Postman Collection run from a given URL or path'

  static examples = [
    `$pmac collection run
`,
    `pmac collection run --environment ./.pmac/workspaces/personal/my-workspace/environments/my-environment.postman_environment.json
`,
    `pmac collection run --environment=skip
`,
    `pmac collection run --collection ./.pmac/workspaces/personal/my-workspace/collections/my-collection.postman_collection.json
`,
  ]

  static flags = {
    globals: Flags.string({
      char: 'g',
      helpValue: '<path>',
      description: `Specify a URL or path to a file
      containing Postman Globals`,
    }),
    'iteration-count': Flags.integer({
      char: 'n',
      description: 'Define the number of iterations to run (default: 1)',
      required: false,
      default: 1,
      helpValue: '<n>',
    }),
    'iteration-data': Flags.string({
      char: 'd',
      helpValue: '<path>',
      description: `Specify a data file to use for
      iterations (either JSON or CSV)`,
    }),
    folder: Flags.string({
      helpValue: '<path>',
      multiple: true,
      description: 'Specify the folder to run from a collection. Can be specified multiple times to run multiple folders (default: [])',
      default: [],
    }),
    'global-var': Flags.string({
      helpValue: '<value>',
      description: `Allows the specification of global
      variables via the command line, in a
      key=value format (default: [])`,
    }),
    'env-var': Flags.string({
      helpValue: '<value>',
      description: `Allows the specification of environment
      variables via the command line, in a
      key=value format (default: [])`,
    }),
    'export-environment': Flags.string({
      helpValue: '<path>',
      description: `Exports the final environment to a file
      after completing the run`,
    }),
    'export-globals': Flags.string({
      helpValue: '<path>',
      description: `Exports the final globals to a file
      after completing the run`,
    }),
    'export-collection': Flags.string({
      helpValue: '<path>',
      description: `Exports the executed collection to a
      file after completing the run`,
    }),
    'postman-api-key': Flags.string({
      helpValue: '<apiKey>',
      description: `API Key used to load the resources from
      the Postman API`,
    }),
    bail: Flags.string({
      helpValue: '[modifiers]',
      description: `Specify whether or not to gracefully
      stop a collection run on encountering
      an error and whether to end the run
      with an error based on the optional
      modifier`,
    }),
    'ignore-redirects': Flags.boolean({
      description: `Prevents Newman from automatically
      following 3XX redirect responses`,
    }),
    'suppress-exit-code': Flags.boolean({
      char: 'x',
      description: `Specify whether or not to override the
      default exit code for the current run`,
    }),
    silent: Flags.boolean({
      description: 'Prevents Newman from showing output to CLI',
    }),
    'disable-unicode': Flags.boolean({
      description: `Forces Unicode compliant symbols to be
      replaced by their plain text
      equivalents`,
    }),
    color: Flags.enum({
      description: `Enable/Disable colored output
      (auto|on|off) (default: "auto")`,
      default: 'auto',
      options: ['auto', 'on', 'off'],
    }),
    'delay-request': Flags.integer({
      helpValue: '[n]',
      default: 0,
      description: `Specify the extent of delay between
      requests (milliseconds) (default: 0)`,
    }),
    timeout: Flags.integer({
      helpValue: '[n]',
      default: 0,
      description: `Specify a timeout for collection run
      (milliseconds) (default: 0)`,
    }),
    'timeout-request': Flags.integer({
      helpValue: '[n]',
      default: 0,
      description: `Specify a timeout for requests
      (milliseconds) (default: 0)`,
    }),
    'timeout-script': Flags.integer({
      helpValue: '[n]',
      default: 0,
      description: `Specify a timeout for scripts
      (milliseconds) (default: 0)`,
    }),
    'working-dir': Flags.string({
      helpValue: '<path>',
      description: `Specify the path to the working
      directory`,
    }),
    'no-insecure-file-read': Flags.boolean({
      description: `Prevents reading the files situated
      outside of the working directory`,
      default: false,
    }),
    insecure: Flags.boolean({
      char: 'k',
      description: 'Disables SSL validations',
    }),
    'ssl-client-cert-list': Flags.string({
      helpValue: '<path>',
      description: `Specify the path to a client
      certificates configurations (JSON)`,
    }),
    'ssl-client-cert': Flags.string({
      helpValue: '<path>',
      description: `Specify the path to a client
      certificate private key`,
    }),
    'ssl-client-key': Flags.string({
      helpValue: '<path>',
      description: `Specify the path to a client
      certificate private key`,
    }),
    'ssl-client-passphrase': Flags.string({
      helpValue: '<passphrase>',
      description: `Specify the client certificate
      passphrase (for protected key)`,
    }),
    'ssl-extra-ca-certs': Flags.string({
      helpValue: '<path>',
      description: `Specify additionally trusted CA
      certificates (PEM)`,
    }),
    'cookie-jar': Flags.string({
      helpValue: '<path>',
      description: `Specify the path to a custom cookie jar
      (serialized tough-cookie JSON)`,
    }),
    'export-cookie-jar': Flags.string({
      helpValue: '<path>',
      description: `Exports the cookie jar to a file after
      completing the run`,
    }),
    verbose: Flags.boolean({
      description: `Show detailed information of collection
      run and each request sent`,
    }),
    'skip-environment': Flags.boolean({
      default: false,
      description: 'Skips choosing an environment',
    }),
    environment: Flags.string({
      char: 'e',
      description: 'Specify a URL or path to a Postman Environment, If you wish to skip environment picking use "skip-environment flag"',
      required: false,
      default: '',
      multiple: false,
      helpValue: '<source>',
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
      default: 'cli',
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

    // Environment
    let collectionJson: PostmanCollection | null = null
    if (flags.collection) {
      if (!collectionPathValidator(flags.collection)) {
        this.error('collection path is invalid, please use .pmac valid collection path')
      }
    } else {
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

      collectionJson = chosenCollection
    }

    // Environment
    let environmentJson: PostmanEnvironment | null = null
    if (flags.environment) {
      if (!environmentPathValidator(flags.environment)) {
        this.error('environment path is invalid, please use .pmac valid environment path')
      }
    } else if (!flags['skip-environment']) {
      // if (!commandAndOptions.environment) {
      const { localEnvironments } = await new EnvironmentGetAllLocalAction(
        config,
        chosenWorkspace,
      ).run()

      const { chosenEnvironment } = await new EnvironmentChooseAction(inquirer, localEnvironments).run()

      environmentJson = chosenEnvironment
    }

    console.log(flags)

    // TODO: function that calculates reports
    const reporters = {}
    newman.run({
      collection: flags.collection || collectionJson,
      environment: flags.environment || environmentJson || '',
      envVar: flags['env-var'],
      globals: flags.globals,
      globalVar: flags['global-var'],
      iterationData: flags['iteration-data'],
      iterationCount: Number(flags['iteration-count'] || 1),
      folder: flags.folder,
      workingDir: flags['working-dir'],
      insecureFileRead: flags['no-insecure-file-read'],
      timeout: flags.timeout,
      timeoutRequest: flags['timeout-request'],
      timeoutScript: flags['timeout-script'],
      delayRequest: flags['delay-request'],
      ignoreRedirects: flags['ignore-redirects'],
      bail: flags.bail,
      suppressExitCode: flags['suppress-exit-code'],
      color: flags.color,
      insecure: flags.insecure,
      sslClientCertList: flags['ssl-client-cert-list'],
      sslClientCert: flags['ssl-client-cert'],
      sslClientKey: flags['ssl-client-key'],
      sslClientPassphrase: flags['ssl-client-passphrase'],
      sslExtraCaCerts: flags['ssl-extra-ca-certs'],
      cookieJar: flags['cookie-jar'],
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
