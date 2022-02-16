`pmac collection`
=================

Creates a new PM collection out of your service OpenApi V3 (swagger) specification.

* [`pmac collection create`](#pmac-collection-create)
* [`pmac collection delete`](#pmac-collection-delete)
* [`pmac collection pull`](#pmac-collection-pull)
* [`pmac collection push`](#pmac-collection-push)
* [`pmac collection run`](#pmac-collection-run)
* [`pmac collection update`](#pmac-collection-update)

## `pmac collection create`

Creates a new PM collection out of your service OpenApi V3 (swagger) specification.

```
USAGE
  $ pmac collection create -o <value> [-w <value>]

FLAGS
  -o, --open-api=./path/to/your/openapi.yml  (required) Path to your OpenApi V3 (known as swagger) specification
  -w, --workspace=<value>                    Path to the required workspace

DESCRIPTION
  Creates a new PM collection out of your service OpenApi V3 (swagger) specification.

EXAMPLES
  $ pmac collection create --open-api ./path/to/your/open-api-v3-spec.yml

  $ pmac collection create -o ./path/to/your/open-api-v3-spec.yml
```

## `pmac collection delete`

Deletes PM collection. default: Deletes from both .pmac (repository), and PM account (remote).

```
USAGE
  $ pmac collection delete [-r] [-l]

FLAGS
  -l, --local-only   Removes collection only from .pmac, keeps workspace in your PM account (remote)
  -r, --remote-only  Removes collection only from your PM account, keeps workspace in .pmac (repository)

DESCRIPTION
  Deletes PM collection. default: Deletes from both .pmac (repository), and PM account (remote).

EXAMPLES
  $pmac collection delete
```

## `pmac collection pull`

Pulls (Fetches) new updates about an existing collection on your .pmac (repository).

```
USAGE
  $ pmac collection pull

DESCRIPTION
  Pulls (Fetches) new updates about an existing collection on your .pmac (repository).

EXAMPLES
  $pmac collection pull
```

## `pmac collection push`

Pulls (Fetches) new updates about an existing collection on your .pmac (repository).

```
USAGE
  $ pmac collection push

DESCRIPTION
  Pulls (Fetches) new updates about an existing collection on your .pmac (repository).

EXAMPLES
  $pmac collection pull
```

## `pmac collection run`

Using `newman run` behind-the-scenes to initiate a Postman Collection run from a given URL or path

```
USAGE
  $ pmac collection run [-g <value>] [-n <value>] [-d <value>] [--folder <value>] [--global-var <value>] [--env-var
    <value>] [--export-environment <value>] [--export-globals <value>] [--export-collection <value>] [--postman-api-key
    <value>] [--bail <value>] [--ignore-redirects] [-x] [--silent] [--disable-unicode] [--color auto|on|off]
    [--delay-request <value>] [--timeout <value>] [--timeout-request <value>] [--timeout-script <value>] [--working-dir
    <value>] [--no-insecure-file-read] [-k] [--ssl-client-cert-list <value>] [--ssl-client-cert <value>]
    [--ssl-client-key <value>] [--ssl-client-passphrase <value>] [--ssl-extra-ca-certs <value>] [--cookie-jar <value>]
    [--export-cookie-jar <value>] [--verbose] [--skip-environment] [-e <value>] [-c <value>] [-r
    cli|html|csv|junit|htmlextra] [--no-summary] [--reporter-no-summary] [--reporter-cli-no-summary]
    [--reporter-cli-silent] [--reporter-cli-show-timestamps] [--reporter-cli-no-failures] [--reporter-cli-no-assertions]
    [--reporter-cli-no-success-assertions] [--reporter-cli-no-console] [--reporter-cli-no-banner]
    [--reporter-json-export <value>] [--reporter-junit-export <value>] [--reporter-html-export <value>]
    [--reporter-html-template <value>] [--reporter-htmlextra-export <value>] [--reporter-htmlextra-template <value>]
    [--reporter-htmlextra-showOnlyFails] [--reporter-htmlextra-testPaging] [--reporter-htmlextra-browserTitle <value>]
    [--reporter-htmlextra-title <value>] [--reporter-htmlextra-titleSize 1|2|3|4|5|6] [--reporter-htmlextra-logs]
    [--reporter-htmlextra-omitRequestBodies] [--reporter-htmlextra-omitResponseBodies]
    [--reporter-htmlextra-hideRequestBody <value>] [--reporter-htmlextra-hideResponseBody <value>]
    [--reporter-htmlextra-showEnvironmentData] [--reporter-htmlextra-skipEnvironmentVars <value>]
    [--reporter-htmlextra-showGlobalData] [--reporter-htmlextra-skipGlobalVars <value>]
    [--reporter-htmlextra-omitHeaders] [--reporter-htmlextra-skipHeaders <value>]
    [--reporter-htmlextra-skipSensitiveData] [--reporter-htmlextra-skipFolders <value>]
    [--reporter-htmlextra-skipRequests <value>] [--reporter-htmlextra-showMarkdownLinks]
    [--reporter-htmlextra-noSyntaxHighlighting] [--reporter-htmlextra-showFolderDescription]
    [--reporter-htmlextra-timezone <value>]

FLAGS
  -c, --collection=<value>       Relative path to your .pmac collection defined JSON
  -d, --iteration-data=<path>    Specify a data file to use for
                                 iterations (either JSON or CSV)
  -e, --environment=<source>     Specify a URL or path to a Postman Environment, If you wish to skip environment pick,
                                 use "skip-environment flag"
  -g, --globals=<path>           Specify a URL or path to a file
                                 containing Postman Globals
  -n, --iteration-count=<n>      [default: 1] Define the number of iterations to run (default: 1)
  -r, --reporters=cli,htmlextra  [default: cli] Specify in comma separated format the reporters to use for this run
                                 (default: ["cli"])
  -x, --suppress-exit-code       Specify whether or not to override the
                                 default exit code for the current run
  --bail=[modifiers]             Specify whether or not to gracefully
                                 stop a collection run on encountering
                                 an error and whether to end the run
                                 with an error based on the optional
                                 modifier
  --color=(auto|on|off)          [default: auto] Enable/Disable colored output
                                 (auto|on|off) (default: "auto")
  --folder=<path>...             [default: ] Specify the folder to run from a collection. Can be specified multiple
                                 times to run multiple folders (default: [])
  --silent                       Prevents Newman from showing output to CLI
  --skip-environment             Skips choosing an environment
  --verbose                      Show detailed information of collection
                                 run and each request sent
  --working-dir=<path>           Specify the path to the working
                                 directory

SECURITY FLAGS
  -k, --insecure                        Disables SSL validations
  --cookie-jar=<path>                   Specify the path to a custom cookie jar
                                        (serialized tough-cookie JSON)
  --disable-unicode                     Forces Unicode compliant symbols to be
                                        replaced by their plain text
                                        equivalents
  --export-cookie-jar=<path>            Exports the cookie jar to a file after
                                        completing the run
  --ignore-redirects                    Prevents Newman from automatically
                                        following 3XX redirect responses
  --no-insecure-file-read               Prevents reading the files situated
                                        outside of the working directory
  --postman-api-key=<apiKey>            API Key used to load the resources from
                                        the Postman API
  --ssl-client-cert=<path>              Specify the path to a client
                                        certificate private key
  --ssl-client-cert-list=<path>         Specify the path to a client
                                        certificates configurations (JSON)
  --ssl-client-key=<path>               Specify the path to a client
                                        certificate private key
  --ssl-client-passphrase=<passphrase>  Specify the client certificate
                                        passphrase (for protected key)
  --ssl-extra-ca-certs=<path>           Specify additionally trusted CA
                                        certificates (PEM)

TIMES FLAGS
  --delay-request=[n]    Specify the extent of delay between
                         requests (milliseconds) (default: 0)
  --timeout=[n]          Specify a timeout for collection run
                         (milliseconds) (default: 0)
  --timeout-request=[n]  Specify a timeout for requests
                         (milliseconds) (default: 0)
  --timeout-script=[n]   Specify a timeout for scripts
                         (milliseconds) (default: 0)

INILINE ENVIRONMENT VARIABLES FLAGS
  --env-var=<value>     Allows the specification of environment
                        variables via the command line, in a
                        key=value format (default: [])
  --global-var=<value>  Allows the specification of global
                        variables via the command line, in a
                        key=value format (default: [])

EXPORT FLAGS
  --export-collection=<path>   Exports the executed collection to a
                               file after completing the run
  --export-environment=<path>  Exports the final environment to a file
                               after completing the run
  --export-globals=<path>      Exports the final globals to a file
                               after completing the run

CLI REPORTER FLAGS
  --no-summary                          The statistical summary table is not shown.
  --reporter-cli-no-assertions          This turns off the output for request-wise assertions as they happen.
  --reporter-cli-no-banner              This turns off the newman banner shown at the beginning of each collection run.
  --reporter-cli-no-console             This turns off the output of console.log (and other console calls) from
                                        collection's scripts.
  --reporter-cli-no-failures            This prevents the run failures from being separately printed.
  --reporter-cli-no-success-assertions  This turns off the output for successful assertions as they happen.
  --reporter-cli-no-summary             The statistical summary table is not shown.
  --reporter-cli-show-timestamps        This prints the local time for each request made.
  --reporter-cli-silent                 The CLI reporter is internally disabled and you see no output to terminal.
  --reporter-no-summary                 The statistical summary table is not shown.

HTML REPORTER FLAGS
  --reporter-html-export=<path>    Specify a path where the output HTML file will be written to disk. If not specified,
                                   the file will be written to newman/ in the current working directory.
  --reporter-html-template=<path>  Specify a path to the custom template which will be used to render the HTML report.
                                   This option depends on --reporter html and --reporter-html-export being present in
                                   the run command. If this option is not specified, the default template is used

HTMLEXTRA REPORTER FLAGS
  --reporter-htmlextra-browserTitle=<title>                Use this optional flag to change the name of the title in the
                                                           browser tab. The default name is "Newman Summary Report".
  --reporter-htmlextra-export=<path>                       Specify a path where the output HTML file will be written to
                                                           disk. If not specified, the file will be written to newman/
                                                           in the current working directory.
  --reporter-htmlextra-hideRequestBody=<request-name>      An optional flag which allows you to exclude certain Request
                                                           Bodies from the final report. Enter the name of the request
                                                           that you wish to hide.
  --reporter-htmlextra-hideResponseBody=<request-name>     An optional flag which allows you to exclude certain Response
                                                           Bodies from the final report. Enter the name of the request
                                                           that you wish to hide.
  --reporter-htmlextra-logs                                This optional flag shows any console log statements in the
                                                           collection, on the final report. This is false by default.
  --reporter-htmlextra-noSyntaxHighlighting                An optional flag which allows you disable the code syntax
                                                           highlighting. This could enhance the performance of opening
                                                           larger reports.
  --reporter-htmlextra-omitHeaders                         An optional flag which allows you to exclude all Headers from
                                                           the final report
  --reporter-htmlextra-omitRequestBodies                   An optional flag which allows you to exclude all Request
                                                           Bodies from the final report
  --reporter-htmlextra-omitResponseBodies                  An optional flag which allows you to exclude all Response
                                                           Bodies from the final report
  --reporter-htmlextra-showEnvironmentData                 An optional flag which allows you to show all the Environment
                                                           variables used during the run, in the final report
  --reporter-htmlextra-showFolderDescription               An optional flag which allows you to show all the folder
                                                           descriptions, in the final report
  --reporter-htmlextra-showGlobalData                      An optional flag which allows you to show all the Global
                                                           variables used during the run, in the final report
  --reporter-htmlextra-showMarkdownLinks                   An optional flag which allows you render Markdown links from
                                                           the test names and pm.expect() statements, in the final
                                                           report. This could be useful if you use an external bug
                                                           tracker.
  --reporter-htmlextra-showOnlyFails                       Use this optional flag to tell the reporter to display only
                                                           the requests with failed tests.
  --reporter-htmlextra-skipEnvironmentVars=<env-var-name>  An optional flag which allows you to exclude certain
                                                           Environment variables from the final report
  --reporter-htmlextra-skipFolders=<req1,req2,...>         An optional flag that will exclude specified folders and
                                                           their corresponding requests, in the final report. Ensure
                                                           that folder names are separated with comma ',' and without
                                                           space.
  --reporter-htmlextra-skipGlobalVars=<global-var-name>    An optional flag which allows you to exclude certain Global
                                                           variables from the final report
  --reporter-htmlextra-skipHeaders=<header-name>           An optional flag which allows you to exclude certain Headers
                                                           from the final report
  --reporter-htmlextra-skipRequests=<req1,req2,...>        An optional flag that will exclude specified requests, in the
                                                           final report. Ensure that request names are separated with
                                                           comma ',' and without space.
  --reporter-htmlextra-skipSensitiveData                   An optional flag that will exclude all the Request/Response
                                                           Headers and the Request/Response bodies, from each request in
                                                           the final report. This will only show the main request info
                                                           and the Test Results. This is false by default.
  --reporter-htmlextra-template=<path>                     Specify a path to the custom template which will be used to
                                                           render the HTML report. This option depends on --reporter
                                                           htmlextra and --reporter-htmlextra-export being present in
                                                           the run command. If this option is not specified, the default
                                                           template is used
  --reporter-htmlextra-testPaging                          Use this optional flag to add pagination to the tests in the
                                                           request view.
  --reporter-htmlextra-timezone=<Australia/Sydney">        An optional flag which allows you to set the timezone on the
                                                           final report's timestamp
  --reporter-htmlextra-title=<title>                       This optional flag can be used to give your report a
                                                           different main Title in the centre of the report. If this is
                                                           not set, the report will show "Newman Run Dashboard".
  --reporter-htmlextra-titleSize=<size>                    [default: 2] An optional flag to reduce the size of the main
                                                           report title. The sizes range from 1 to 6, the higher the
                                                           number, the smaller the title will be. The default size is 2.

JSON REPORTER FLAGS
  --reporter-json-export=<path>  Specify a path where the output JSON file will be written to disk. If not specified,
                                 the file will be written to newman/ in the current working directory. If the specified
                                 path does not exist, it will be created. However, if the specified path is a
                                 pre-existing directory, the report will be generated in that directory.

JUNIT REPORTER FLAGS
  --reporter-junit-export=<path>  Specify a path where the output XML file will be written to disk. If not specified,
                                  the file will be written to newman/ in the current working directory. If the specified
                                  path does not exist, it will be created. However, if the specified path is a
                                  pre-existing directory, the report will be generated in that directory.

DESCRIPTION
  Using `newman run` behind-the-scenes to initiate a Postman Collection run from a given URL or path

EXAMPLES
  $pmac collection run

  $ pmac collection run --environment ./.pmac/workspaces/personal/my-workspace/environments/my-environment.postman_environment.json

  $ pmac collection run --skip-environment

  $ pmac collection run --collection ./.pmac/workspaces/personal/my-workspace/collections/my-collection.postman_collection.json
```

## `pmac collection update`

Updates PM collection following changes from your OpenApi V3 (swagger) specification,

```
USAGE
  $ pmac collection update -o <value>

FLAGS
  -o, --open-api=./path/to/your/openapi.yml  (required) Path to your OpenApi V3 (known as swagger) specification

DESCRIPTION
  Updates PM collection following changes from your OpenApi V3 (swagger) specification,

  Without overwrite defined PM events for the existing items (pre-request scripts, test, etc.).

EXAMPLES
  $pmac collection update --open-api ./path/to/your/open-api-v3-spec.yml

  $pmac collection update -o ./path/to/your/open-api-v3-spec.yml
```
