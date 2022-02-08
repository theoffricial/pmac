pmac CLI

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g pmac
$ pmac COMMAND
running command...
$ pmac (--version)
pmac/0.0.3 darwin-x64 node-v14.17.1
$ pmac --help [COMMAND]
USAGE
  $ pmac COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`pmac autocomplete [SHELL]`](#pmac-autocomplete-shell)
* [`pmac collection create`](#pmac-collection-create)
* [`pmac collection delete`](#pmac-collection-delete)
* [`pmac collection pull`](#pmac-collection-pull)
* [`pmac collection push`](#pmac-collection-push)
* [`pmac collection run [APIKEY]`](#pmac-collection-run-apikey)
* [`pmac collection update`](#pmac-collection-update)
* [`pmac environment create`](#pmac-environment-create)
* [`pmac environment delete`](#pmac-environment-delete)
* [`pmac environment pull`](#pmac-environment-pull)
* [`pmac environment push`](#pmac-environment-push)
* [`pmac hello PERSON`](#pmac-hello-person)
* [`pmac hello world`](#pmac-hello-world)
* [`pmac help [COMMAND]`](#pmac-help-command)
* [`pmac init`](#pmac-init)
* [`pmac plugins`](#pmac-plugins)
* [`pmac plugins:inspect PLUGIN...`](#pmac-pluginsinspect-plugin)
* [`pmac plugins:install PLUGIN...`](#pmac-pluginsinstall-plugin)
* [`pmac plugins:link PLUGIN`](#pmac-pluginslink-plugin)
* [`pmac plugins:uninstall PLUGIN...`](#pmac-pluginsuninstall-plugin)
* [`pmac plugins update`](#pmac-plugins-update)
* [`pmac pm-account api-key-delete`](#pmac-pm-account-api-key-delete)
* [`pmac pm-account api-key-update APIKEY`](#pmac-pm-account-api-key-update-apikey)
* [`pmac workspace create`](#pmac-workspace-create)
* [`pmac workspace delete`](#pmac-workspace-delete)
* [`pmac workspace fetch-pulled`](#pmac-workspace-fetch-pulled)
* [`pmac workspace pull`](#pmac-workspace-pull)
* [`pmac workspace pull-whole-account`](#pmac-workspace-pull-whole-account)

## `pmac autocomplete [SHELL]`

display autocomplete installation instructions

```
USAGE
  $ pmac autocomplete [SHELL] [-r]

ARGUMENTS
  SHELL  shell type

FLAGS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

DESCRIPTION
  display autocomplete installation instructions

EXAMPLES
  $ pmac autocomplete

  $ pmac autocomplete bash

  $ pmac autocomplete zsh

  $ pmac autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v1.1.1/src/commands/autocomplete/index.ts)_

## `pmac collection create`

Creates a new PM collection out of your service OpenApi V3 (swagger) specification.

```
USAGE
  $ pmac collection create -o <value>

FLAGS
  -o, --open-api=./path/to/your/openapi.yml  (required) Path to your OpenApi V3 (known as swagger) specification

DESCRIPTION
  Creates a new PM collection out of your service OpenApi V3 (swagger) specification.

EXAMPLES
  $pmac collection create --open-api ./path/to/your/open-api-v3-spec.yml

  $pmac collection create -o ./path/to/your/open-api-v3-spec.yml
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

## `pmac collection run [APIKEY]`

Runs PM collection

```
USAGE
  $ pmac collection run [APIKEY] [-n <value>] [-e <value>] [-c <value>] [-r cli|html|csv]

ARGUMENTS
  APIKEY  Postman api key

FLAGS
  -c, --collection=<value>       Relative path to your .pmac collection defined JSON
  -e, --environment=<value>      Relative path to your .pmac environment defined JSON
  -n, --iteration-count=<value>  [default: 1] Number of iteration to run collection, default: 1
  -r, --reporters=<option>       [default: cli,html] Comma separated reports types, options: cli,html,csv
                                 <options: cli|html|csv>

DESCRIPTION
  Runs PM collection

EXAMPLES
  $pmac collection run
```

# Run Options

`pmac` is using `newman` behind-the-scenes, which means that `pmac` is supporting all `newman` features, to research for the full list of options including more detailed examples see [newman](https://github.com/postmanlabs/newman#command-line-options) command line options.

Also `pmac` supports all `newman`'s [`default reports`](https://github.com/postmanlabs/newman#reporters), and the external report [`htmlextra`](https://github.com/DannyDainton/newman-reporter-htmlextra#newman-reporter-htmlextra). `options: ['cli', 'html', 'csv', 'junit', 'htmlextra']`.

## Newman Supported Command Line Options

To check the full options list click [here](https://github.com/postmanlabs/newman#newman-run-collection-file-source-options)

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

## `pmac environment create`

Creates a new PM environment.

```
USAGE
  $ pmac environment create

DESCRIPTION
  Creates a new PM environment.

EXAMPLES
  $pmac environment create
```

## `pmac environment delete`

Deletes PM environment. default: Deletes from both .pmac (repository), and PM account (remote).

```
USAGE
  $ pmac environment delete [-r] [-l]

FLAGS
  -l, --local-only   Removes environment only from .pmac, keeps workspace in your PM account (remote)
  -r, --remote-only  Removes environment only from your PM account, keeps workspace in .pmac (repository)

DESCRIPTION
  Deletes PM environment. default: Deletes from both .pmac (repository), and PM account (remote).

EXAMPLES
  $pmac environment delete
```

## `pmac environment pull`

Pulls (Fetches) new updates about an existing collection on your .pmac (repository).

```
USAGE
  $ pmac environment pull

DESCRIPTION
  Pulls (Fetches) new updates about an existing collection on your .pmac (repository).

EXAMPLES
  $pmac collection pull
```

## `pmac environment push`

Pushes (Fetches) environment updates to your PM account (remote) from your .pmac (repository).

```
USAGE
  $ pmac environment push

DESCRIPTION
  Pushes (Fetches) environment updates to your PM account (remote) from your .pmac (repository).

EXAMPLES
  $pmac environment push
```

## `pmac hello PERSON`

Say hello

```
USAGE
  $ pmac hello [PERSON] -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Whom is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/unicop/pmac/blob/v0.0.3/dist/commands/hello/index.ts)_

## `pmac hello world`

Say hello world

```
USAGE
  $ pmac hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ oex hello world
  hello world! (./src/commands/hello/world.ts)
```

## `pmac help [COMMAND]`

Display help for pmac.

```
USAGE
  $ pmac help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for pmac.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.9/src/commands/help.ts)_

## `pmac init`

Initial pmac environment

```
USAGE
  $ pmac init -k <value>

FLAGS
  -k, --api-key=<value>  (required) Your PM account api key, .pmac need it to integrate with your PM account, if you
                         have not generated one yet,
                         please generate it at: https://learning.postman.com/docs/developer/intro-api/

DESCRIPTION
  Initial pmac environment

EXAMPLES
  $pmac init --api-key "your-pm-api-key"

  $pmac init -k "your-pm-api-key"
```

_See code: [dist/commands/init/index.ts](https://github.com/unicop/pmac/blob/v0.0.3/dist/commands/init/index.ts)_

## `pmac plugins`

List installed plugins.

```
USAGE
  $ pmac plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ pmac plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.0.11/src/commands/plugins/index.ts)_

## `pmac plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ pmac plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ pmac plugins:inspect myplugin
```

## `pmac plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ pmac plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ pmac plugins add

EXAMPLES
  $ pmac plugins:install myplugin 

  $ pmac plugins:install https://github.com/someuser/someplugin

  $ pmac plugins:install someuser/someplugin
```

## `pmac plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ pmac plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLES
  $ pmac plugins:link myplugin
```

## `pmac plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ pmac plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ pmac plugins unlink
  $ pmac plugins remove
```

## `pmac plugins update`

Update installed plugins.

```
USAGE
  $ pmac plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

## `pmac pm-account api-key-delete`

Update your PM api key

```
USAGE
  $ pmac pm-account api-key-delete

DESCRIPTION
  Update your PM api key

EXAMPLES
  $pmac pm api-key-update <your-pm-api-key>
```

## `pmac pm-account api-key-update APIKEY`

Update your PM api key

```
USAGE
  $ pmac pm-account api-key-update [APIKEY]

ARGUMENTS
  APIKEY  Postman api key

DESCRIPTION
  Update your PM api key

EXAMPLES
  $pmac pm api-key-update <your-pm-api-key>
```

## `pmac workspace create`

Creates new PM collection

```
USAGE
  $ pmac workspace create [-k <value>]

FLAGS
  -k, --api-key=<your PM api key>  Dynamic api key

DESCRIPTION
  Creates new PM collection

EXAMPLES
  $pmac collection create
```

## `pmac workspace delete`

Deletes PM workspace, default: removes workspace from both .pmac (repository) and PM account (remote).

```
USAGE
  $ pmac workspace delete [-r] [-l]

FLAGS
  -l, --local-only   Removes workspace only from .pmac, keeps workspace in your PM account (remote)
  -r, --remote-only  Removes workspace only from your PM account, keeps workspace in .pmac (repository)

DESCRIPTION
  Deletes PM workspace, default: removes workspace from both .pmac (repository) and PM account (remote).

EXAMPLES
  $pmac workspace delete
```

## `pmac workspace fetch-pulled`

Fetches pulled workspace to be up-to-date.

```
USAGE
  $ pmac workspace fetch-pulled

DESCRIPTION
  Fetches pulled workspace to be up-to-date.

EXAMPLES
  $pmac workspace fetch-pulled
```

## `pmac workspace pull`

Pulls a single workspace from PM account

```
USAGE
  $ pmac workspace pull [--id <value>] [-n <value>]

FLAGS
  -n, --name=<workspace name>   The exact name of your workspace, on name duplication will pick first match.
  --id=<workspace specific id>  workspace id

DESCRIPTION
  Pulls a single workspace from PM account

EXAMPLES
  $pmac workspace pull
```

## `pmac workspace pull-whole-account`

Pulls all workspaces within your account.

```
USAGE
  $ pmac workspace pull-whole-account

DESCRIPTION
  Pulls all workspaces within your account.

EXAMPLES
  $pmac workspace pull-whole-account
```
<!-- commandsstop -->