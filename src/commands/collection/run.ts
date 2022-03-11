import { Command, Flags } from '@oclif/core'
import newman from 'newman'
import inquirer from 'inquirer'
import { fsWorkspaceManager, fsWorkspaceResourceManager, pmacDotEnv } from '../../file-system'
import { CollectionChooseAction, PMACCollectionGetAllAction, EnvironmentChooseAction, PMACWorkspaceChooseAction, PMACWorkspaceGetAllAction } from '../../postman/actions'
import { PMACEnvironmentGetAllAction } from '../../postman/actions/pmac-environment-get-all.action'
import { collectionPathValidator, environmentPathValidator } from '../../validators'
import { PostmanEnvironment } from '../../postman/api/types'
import { PostmanCollection } from '../../postman/api/types/collection.types'
import * as runHelpers from '../../commands-helpers/collection/run.helper'
import { PMAC_FILE_SYS } from '../../file-system/fs-pmac.constants'

enum RUN_FLAG_GROUP {
  FUNDAMENTALS = 'fundamentals',
  STYLE = 'style',
  TIMES = 'times',
  CLI_REPORTER = 'CLI reporter',
  HTML_REPORTER = 'HTML reporter',
  JSON_REPORTER = 'JSON reporter',
  JUNIT_REPORTER = 'junit reporter',
  HTMLEXTRA_REPORTER = 'HTMLEXTRA reporter',
  INLINE_ENVIRONMENT_VARIABLES = 'iniline environment variables',
  SECURITY = 'security',
  EXPORT = 'export',
}

export default class CollectionRun extends Command {
  static description = 'Using `newman run` behind-the-scenes to initiate a Postman Collection run from a given URL or path'

  static examples = [
    `$pmac collection run
`,
    `pmac collection run --environment ./.pmac/workspaces/personal/my-workspace/environments/my-environment.postman_environment.json
`,
    `pmac collection run --skip-environment
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
      // helpGroup: RUN_FLAG_GROUP.FUNDAMENTALS,
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
      helpGroup: RUN_FLAG_GROUP.INLINE_ENVIRONMENT_VARIABLES,
    }),
    // newman originally set this to 'string'
    'env-var': Flags.boolean({
      // helpValue: '<value>',
      // description: `Allows the specification of environment
      // variables via the command line, in a
      // key=value format (default: [])`,
      description: `Allows the specification of environment
      variables via .env file, watching for "${PMAC_FILE_SYS.PMAC_ENV_VARS.TEXT_ENV_VAR_PREFIX}" environment variables, 
      cut its prefix and set them as camelcase.
      Default takes ".env", if you wish to customize it, use "env-var-path" flag.`,
      helpGroup: RUN_FLAG_GROUP.FUNDAMENTALS,
    }),
    'env-var-path': Flags.string({
      description: 'A custom relative path to your .env file',
      helpGroup: RUN_FLAG_GROUP.FUNDAMENTALS,
      helpValue: '<my/custom/dotenv/path/.env',
    }),
    'export-environment': Flags.string({
      helpValue: '<path>',
      description: `Exports the final environment to a file
      after completing the run`,
      helpGroup: RUN_FLAG_GROUP.EXPORT,
    }),
    'export-globals': Flags.string({
      helpValue: '<path>',
      description: `Exports the final globals to a file
      after completing the run`,
      helpGroup: RUN_FLAG_GROUP.EXPORT,
    }),
    'export-collection': Flags.string({
      helpValue: '<path>',
      description: `Exports the executed collection to a
      file after completing the run`,
      helpGroup: RUN_FLAG_GROUP.EXPORT,
    }),
    'postman-api-key': Flags.string({
      helpValue: '<apiKey>',
      description: `API Key used to load the resources from
      the Postman API`,
      helpGroup: RUN_FLAG_GROUP.SECURITY,
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
      helpGroup: RUN_FLAG_GROUP.SECURITY,
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
      helpGroup: RUN_FLAG_GROUP.SECURITY,
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
      helpGroup: RUN_FLAG_GROUP.TIMES,
    }),
    timeout: Flags.integer({
      helpValue: '[n]',
      default: 0,
      description: `Specify a timeout for collection run
      (milliseconds) (default: 0)`,
      helpGroup: RUN_FLAG_GROUP.TIMES,
    }),
    'timeout-request': Flags.integer({
      helpValue: '[n]',
      default: 0,
      description: `Specify a timeout for requests
      (milliseconds) (default: 0)`,
      helpGroup: RUN_FLAG_GROUP.TIMES,
    }),
    'timeout-script': Flags.integer({
      helpValue: '[n]',
      default: 0,
      description: `Specify a timeout for scripts
      (milliseconds) (default: 0)`,
      helpGroup: RUN_FLAG_GROUP.TIMES,
    }),
    'working-dir': Flags.string({
      helpValue: '<path>',
      description: `Specify the path to the working
      directory`,
      // helpGroup: RUN_FLAG_GROUP.FUNDAMENTALS,
    }),
    'no-insecure-file-read': Flags.boolean({
      description: `Prevents reading the files situated
      outside of the working directory`,
      default: false,
      helpGroup: RUN_FLAG_GROUP.SECURITY,
    }),
    insecure: Flags.boolean({
      char: 'k',
      description: 'Disables SSL validations',
      helpGroup: RUN_FLAG_GROUP.SECURITY,
    }),
    'ssl-client-cert-list': Flags.string({
      helpValue: '<path>',
      description: `Specify the path to a client
      certificates configurations (JSON)`,
      helpGroup: RUN_FLAG_GROUP.SECURITY,
    }),
    'ssl-client-cert': Flags.string({
      helpValue: '<path>',
      description: `Specify the path to a client
      certificate private key`,
      helpGroup: RUN_FLAG_GROUP.SECURITY,
    }),
    'ssl-client-key': Flags.string({
      helpValue: '<path>',
      description: `Specify the path to a client
      certificate private key`,
      helpGroup: RUN_FLAG_GROUP.SECURITY,
    }),
    'ssl-client-passphrase': Flags.string({
      helpValue: '<passphrase>',
      description: `Specify the client certificate
      passphrase (for protected key)`,
      helpGroup: RUN_FLAG_GROUP.SECURITY,
    }),
    'ssl-extra-ca-certs': Flags.string({
      helpValue: '<path>',
      description: `Specify additionally trusted CA
      certificates (PEM)`,
      helpGroup: RUN_FLAG_GROUP.SECURITY,
    }),
    'cookie-jar': Flags.string({
      helpValue: '<path>',
      description: `Specify the path to a custom cookie jar
      (serialized tough-cookie JSON)`,
      helpGroup: RUN_FLAG_GROUP.SECURITY,
    }),
    'export-cookie-jar': Flags.string({
      helpValue: '<path>',
      description: `Exports the cookie jar to a file after
      completing the run`,
      helpGroup: RUN_FLAG_GROUP.SECURITY,
    }),
    verbose: Flags.boolean({
      description: `Show detailed information of collection
      run and each request sent`,
    }),
    'skip-environment': Flags.boolean({
      default: false,
      description: 'Skips choosing an environment',
      // helpGroup: RUN_FLAG_GROUP.FUNDAMENTALS,
    }),
    environment: Flags.string({
      char: 'e',
      description: 'Specify a URL or path to a Postman Environment, If you wish to skip environment pick, use "skip-environment flag"',
      required: false,
      default: '',
      multiple: false,
      helpValue: '<source>',
      // helpGroup: RUN_FLAG_GROUP.FUNDAMENTALS,
    }),
    collection: Flags.string({
      char: 'c',
      description: 'Relative path to your .pmac collection defined JSON',
      required: false,
      default: '',
      // helpGroup: RUN_FLAG_GROUP.FUNDAMENTALS,
    }),
    reporters: Flags.string({
      char: 'r',
      description: 'Specify in comma separated format the reporters to use for this run (default: ["cli"])',
      helpValue: 'cli,htmlextra',
      options: ['cli', 'html', 'csv', 'junit', 'htmlextra'],
      required: false,
      default: 'cli',
    }),
    'no-summary': Flags.boolean({
      description: 'The statistical summary table is not shown.',
      helpGroup: RUN_FLAG_GROUP.CLI_REPORTER,
    }),
    'reporter-no-summary': Flags.boolean({
      description: 'The statistical summary table is not shown.',
      helpGroup: RUN_FLAG_GROUP.CLI_REPORTER,
    }),
    'reporter-cli-no-summary': Flags.boolean({
      description: 'The statistical summary table is not shown.',
      helpGroup: RUN_FLAG_GROUP.CLI_REPORTER,
    }),
    'reporter-cli-silent': Flags.boolean({
      description: 'The CLI reporter is internally disabled and you see no output to terminal.',
      helpGroup: RUN_FLAG_GROUP.CLI_REPORTER,
    }),
    'reporter-cli-show-timestamps': Flags.boolean({
      description: 'This prints the local time for each request made.',
      helpGroup: RUN_FLAG_GROUP.CLI_REPORTER,
    }),
    'reporter-cli-no-failures': Flags.boolean({
      description: 'This prevents the run failures from being separately printed.',
      helpGroup: RUN_FLAG_GROUP.CLI_REPORTER,
    }),
    'reporter-cli-no-assertions': Flags.boolean({
      description: 'This turns off the output for request-wise assertions as they happen.',
      helpGroup: RUN_FLAG_GROUP.CLI_REPORTER,
    }),
    'reporter-cli-no-success-assertions': Flags.boolean({
      description: 'This turns off the output for successful assertions as they happen.',
      helpGroup: RUN_FLAG_GROUP.CLI_REPORTER,
    }),
    'reporter-cli-no-console': Flags.boolean({
      description: 'This turns off the output of console.log (and other console calls) from collection\'s scripts.',
      helpGroup: RUN_FLAG_GROUP.CLI_REPORTER,
    }),
    'reporter-cli-no-banner': Flags.boolean({
      description: 'This turns off the newman banner shown at the beginning of each collection run.',
      helpGroup: RUN_FLAG_GROUP.CLI_REPORTER,
    }),
    'reporter-json-export': Flags.string({
      helpValue: '<path>',
      description: 'Specify a path where the output JSON file will be written to disk. If not specified, the file will be written to newman/ in the current working directory. If the specified path does not exist, it will be created. However, if the specified path is a pre-existing directory, the report will be generated in that directory.',
      helpGroup: RUN_FLAG_GROUP.JSON_REPORTER,
    }),
    'reporter-junit-export': Flags.string({
      helpValue: '<path>',
      description: 'Specify a path where the output XML file will be written to disk. If not specified, the file will be written to newman/ in the current working directory. If the specified path does not exist, it will be created. However, if the specified path is a pre-existing directory, the report will be generated in that directory.',
      helpGroup: RUN_FLAG_GROUP.JUNIT_REPORTER,
    }),
    'reporter-html-export': Flags.string({
      helpValue: '<path>',
      description: 'Specify a path where the output HTML file will be written to disk. If not specified, the file will be written to newman/ in the current working directory.',
      helpGroup: RUN_FLAG_GROUP.HTML_REPORTER,
    }),
    'reporter-html-template': Flags.string({
      helpValue: '<path>',
      description: 'Specify a path to the custom template which will be used to render the HTML report. This option depends on --reporter html and --reporter-html-export being present in the run command. If this option is not specified, the default template is used',
      helpGroup: RUN_FLAG_GROUP.HTML_REPORTER,
    }),
    'reporter-htmlextra-export': Flags.string({
      helpValue: '<path>',
      helpGroup: RUN_FLAG_GROUP.HTMLEXTRA_REPORTER,
      description: 'Specify a path where the output HTML file will be written to disk. If not specified, the file will be written to newman/ in the current working directory.',
    }),
    'reporter-htmlextra-template': Flags.string({
      helpValue: '<path>',
      helpGroup: RUN_FLAG_GROUP.HTMLEXTRA_REPORTER,
      description: 'Specify a path to the custom template which will be used to render the HTML report. This option depends on --reporter htmlextra and --reporter-htmlextra-export being present in the run command. If this option is not specified, the default template is used',
    }),
    'reporter-htmlextra-showOnlyFails': Flags.boolean({
      helpGroup: RUN_FLAG_GROUP.HTMLEXTRA_REPORTER,
      description: 'Use this optional flag to tell the reporter to display only the requests with failed tests.',
    }),
    'reporter-htmlextra-testPaging': Flags.boolean({
      helpGroup: RUN_FLAG_GROUP.HTMLEXTRA_REPORTER,
      description: 'Use this optional flag to add pagination to the tests in the request view.',
    }),
    'reporter-htmlextra-browserTitle': Flags.string({
      helpValue: '<title>',
      helpGroup: RUN_FLAG_GROUP.HTMLEXTRA_REPORTER,
      description: 'Use this optional flag to change the name of the title in the browser tab. The default name is "Newman Summary Report".',
    }),
    'reporter-htmlextra-title': Flags.string({
      helpGroup: RUN_FLAG_GROUP.HTMLEXTRA_REPORTER,
      description: 'This optional flag can be used to give your report a different main Title in the centre of the report. If this is not set, the report will show "Newman Run Dashboard".',
      helpValue: '<title>',
    }),
    'reporter-htmlextra-titleSize': Flags.enum({
      helpValue: '<size>',
      helpGroup: RUN_FLAG_GROUP.HTMLEXTRA_REPORTER,
      options: ['1', '2', '3', '4', '5', '6'],
      default: '2',
      description: 'An optional flag to reduce the size of the main report title. The sizes range from 1 to 6, the higher the number, the smaller the title will be. The default size is 2.',
    }),
    'reporter-htmlextra-logs': Flags.boolean({
      description: 'This optional flag shows any console log statements in the collection, on the final report. This is false by default.',
      helpGroup: RUN_FLAG_GROUP.HTMLEXTRA_REPORTER,
    }),
    'reporter-htmlextra-omitRequestBodies': Flags.boolean({
      description: 'An optional flag which allows you to exclude all Request Bodies from the final report',
      helpGroup: RUN_FLAG_GROUP.HTMLEXTRA_REPORTER,
    }),
    'reporter-htmlextra-omitResponseBodies': Flags.boolean({
      description: 'An optional flag which allows you to exclude all Response Bodies from the final report',
      helpGroup: RUN_FLAG_GROUP.HTMLEXTRA_REPORTER,
    }),
    'reporter-htmlextra-hideRequestBody': Flags.string({
      description: 'An optional flag which allows you to exclude certain Request Bodies from the final report. Enter the name of the request that you wish to hide.',
      helpValue: '<request-name>',
      helpGroup: RUN_FLAG_GROUP.HTMLEXTRA_REPORTER,
    }),
    'reporter-htmlextra-hideResponseBody': Flags.string({
      description: 'An optional flag which allows you to exclude certain Response Bodies from the final report. Enter the name of the request that you wish to hide.',
      helpValue: '<request-name>',
      helpGroup: RUN_FLAG_GROUP.HTMLEXTRA_REPORTER,
    }),
    'reporter-htmlextra-showEnvironmentData': Flags.boolean({
      description: 'An optional flag which allows you to show all the Environment variables used during the run, in the final report',
      helpGroup: RUN_FLAG_GROUP.HTMLEXTRA_REPORTER,
    }),
    'reporter-htmlextra-skipEnvironmentVars': Flags.string({
      description: 'An optional flag which allows you to exclude certain Environment variables from the final report',
      helpValue: '<env-var-name>',
      helpGroup: RUN_FLAG_GROUP.HTMLEXTRA_REPORTER,
    }),
    'reporter-htmlextra-showGlobalData': Flags.boolean({
      description: 'An optional flag which allows you to show all the Global variables used during the run, in the final report',
      helpGroup: RUN_FLAG_GROUP.HTMLEXTRA_REPORTER,
    }),
    'reporter-htmlextra-skipGlobalVars': Flags.string({
      description: 'An optional flag which allows you to exclude certain Global variables from the final report',
      helpGroup: RUN_FLAG_GROUP.HTMLEXTRA_REPORTER,
      helpValue: '<global-var-name>',
    }),
    'reporter-htmlextra-omitHeaders': Flags.boolean({
      helpGroup: RUN_FLAG_GROUP.HTMLEXTRA_REPORTER,
      description: 'An optional flag which allows you to exclude all Headers from the final report',
    }),
    'reporter-htmlextra-skipHeaders': Flags.string({
      description: 'An optional flag which allows you to exclude certain Headers from the final report',
      helpGroup: RUN_FLAG_GROUP.HTMLEXTRA_REPORTER,
      helpValue: '<header-name>',
    }),
    'reporter-htmlextra-skipSensitiveData': Flags.boolean({
      description: 'An optional flag that will exclude all the Request/Response Headers and the Request/Response bodies, from each request in the final report. This will only show the main request info and the Test Results. This is false by default.',
      helpGroup: RUN_FLAG_GROUP.HTMLEXTRA_REPORTER,
    }),
    'reporter-htmlextra-skipFolders': Flags.string({
      description: 'An optional flag that will exclude specified folders and their corresponding requests, in the final report. Ensure that folder names are separated with comma \',\' and without space.',
      helpGroup: RUN_FLAG_GROUP.HTMLEXTRA_REPORTER,
      helpValue: '<req1,req2,...>',
    }),
    'reporter-htmlextra-skipRequests': Flags.string({
      description: 'An optional flag that will exclude specified requests, in the final report. Ensure that request names are separated with comma \',\' and without space.',
      helpGroup: RUN_FLAG_GROUP.HTMLEXTRA_REPORTER,
      helpValue: '<req1,req2,...>',
    }),
    'reporter-htmlextra-showMarkdownLinks': Flags.boolean({
      description: 'An optional flag which allows you render Markdown links from the test names and pm.expect() statements, in the final report. This could be useful if you use an external bug tracker.',
      helpGroup: RUN_FLAG_GROUP.HTMLEXTRA_REPORTER,
    }),
    'reporter-htmlextra-noSyntaxHighlighting': Flags.boolean({
      description: 'An optional flag which allows you disable the code syntax highlighting. This could enhance the performance of opening larger reports.',
      helpGroup: RUN_FLAG_GROUP.HTMLEXTRA_REPORTER,
    }),
    'reporter-htmlextra-showFolderDescription': Flags.boolean({
      description: 'An optional flag which allows you to show all the folder descriptions, in the final report',
      helpGroup: RUN_FLAG_GROUP.HTMLEXTRA_REPORTER,
    }),
    'reporter-htmlextra-timezone': Flags.string({
      description: 'An optional flag which allows you to set the timezone on the final report\'s timestamp',
      helpGroup: RUN_FLAG_GROUP.HTMLEXTRA_REPORTER,
      helpValue: '<Australia/Sydney">',
    }),
  }

  // static args = [{ name: 'apiKey', description: 'Postman api key', required: false }]

  async run(): Promise<void> {
    const { flags } = await this.parse(CollectionRun)

    const pmacWorkspaces = await new PMACWorkspaceGetAllAction(
      fsWorkspaceManager,
    ).run()

    const pmacWorkspace = await new PMACWorkspaceChooseAction(
      inquirer,
      pmacWorkspaces,
    ).run()

    // Environment
    let collectionJson: PostmanCollection | null = null
    if (flags.collection) {
      if (!collectionPathValidator(flags.collection)) {
        this.error('collection path is invalid, please use .pmac valid collection path')
      }
    } else {
      const pmacCollections = await new PMACCollectionGetAllAction(
        fsWorkspaceResourceManager,
        pmacWorkspace,
      ).run()

      if (pmacCollections.length === 0) {
        throw new Error(
          `No collections found for workspace '${pmacWorkspace.name}'`,
        )
      }

      const pmacCollection = await new CollectionChooseAction(
        inquirer,
        pmacCollections,
      ).run()

      collectionJson = pmacCollection
    }

    // Environment
    let environmentJson: PostmanEnvironment | null = null
    if (flags.environment) {
      if (!environmentPathValidator(flags.environment)) {
        this.error('environment path is invalid, please use .pmac valid environment path')
      }
    } else if (!flags['skip-environment']) {
      // if (!commandAndOptions.environment) {
      const pmacEnvironments = await new PMACEnvironmentGetAllAction(
        fsWorkspaceResourceManager,
        pmacWorkspace,
      ).run()

      if (pmacEnvironments.length > 0) {
        environmentJson = await new EnvironmentChooseAction(inquirer, pmacEnvironments).run()
      } else {
        this.log('No environment found for workspace, skipping environment...')
      }
    }

    newman.run({
      collection: flags.collection || collectionJson,
      environment: flags.environment || environmentJson || '',
      envVar: flags['env-var'] && runHelpers.buildNewmanEnvVars(flags['env-var-path']),
      globals: flags.globals,
      globalVar: flags['global-var'],
      iterationData: flags['iteration-data'],
      iterationCount: Number(flags['iteration-count']),
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
      reporters: flags?.reporters?.split(','),
      reporter: {
        cli: {
          noBanner: true || flags['reporter-cli-no-banner'],
          noConsole: flags['reporter-cli-no-console'],
          noAssertions: flags['reporter-cli-no-assertions'],
          noFailures: flags['reporter-cli-no-failures'],
          noSuccessAssertions: flags['reporter-cli-no-success-assertions'],
          noSummary: flags['no-summary'] || flags['reporter-no-summary'] || flags['reporter-cli-no-summary'],
          showTimestamps: flags['reporter-cli-show-timestamps'],
          silent: flags['reporter-cli-silent'],
        },
        junit: {
          export: flags['reporter-junit-export'],
        },
        html: {
          export: flags['reporter-html-export'],
          template: flags['reporter-html-template'],
        },
        // See: https://github.com/DannyDainton/newman-reporter-htmlextra#with-newman-as-a-library
        htmlextra: {
          export: flags['reporter-htmlextra-export'], // './report.html',
          template: flags['reporter-htmlextra-export'], // || './template.hbs',
          logs: flags['reporter-htmlextra-logs'], // true
          showOnlyFails: flags['reporter-htmlextra-showOnlyFails'], // true
          noSyntaxHighlighting: flags['reporter-htmlextra-noSyntaxHighlighting'], // true
          testPaging: flags['reporter-htmlextra-testPaging'], // true
          browserTitle: flags['reporter-htmlextra-browserTitle'], // "My Newman report"
          title: flags['reporter-htmlextra-title'], // "My Newman Report"
          titleSize: flags['reporter-htmlextra-titleSize'], // 4
          omitHeaders: flags['reporter-htmlextra-omitHeaders'], // true
          skipHeaders: flags['reporter-htmlextra-skipHeaders'], // "Authorization"
          omitRequestBodies: flags['reporter-htmlextra-omitRequestBodies'], // true
          omitResponseBodies: flags['reporter-htmlextra-omitResponseBodies'], // true
          hideRequestBody: flags['reporter-htmlextra-hideRequestBody'], // ["Login"]
          hideResponseBody: flags['reporter-htmlextra-hideResponseBody'], // ["Auth Request"]
          showEnvironmentData: flags['reporter-htmlextra-showEnvironmentData'], // true
          skipEnvironmentVars: flags['reporter-htmlextra-skipEnvironmentVars'], // ["API_KEY"]
          showGlobalData: flags['reporter-htmlextra-showGlobalData'], // true
          skipGlobalVars: flags['reporter-htmlextra-skipGlobalVars'], // ["API_TOKEN"]
          skipSensitiveData: flags['reporter-htmlextra-skipSensitiveData'], // true
          showMarkdownLinks: flags['reporter-htmlextra-showMarkdownLinks'], // true
          showFolderDescription: flags['reporter-htmlextra-showFolderDescription'], // true
          timezone: flags['reporter-htmlextra-timezone'], // "Australia/Sydney"
          skipFolders: flags['reporter-htmlextra-skipFolders'], // "folder name with space,folderWithoutSpace"
          skipRequests: flags['reporter-htmlextra-skipRequests'], // "request name with space,requestNameWithoutSpace"
        },
      },
    } as any)
  }
}
