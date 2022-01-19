oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -gpmac
$pmac COMMAND
running command...
$pmac (--version)
pmac/0.0.0 darwin-x64 node-v14.17.1
$pmac --help [COMMAND]
USAGE
  $pmac COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`pmac autocomplete [SHELL]`](#pmac-autocomplete-shell)
* [`pmac collection create [APIKEY]`](#pmac-collection-create-apikey)
* [`pmac hello PERSON`](#pmac-hello-person)
* [`pmac hello world`](#pmac-hello-world)
* [`pmac help [COMMAND]`](#pmac-help-command)
* [`pmac init [APIKEY]`](#pmac-init-apikey)
* [`pmac plugins`](#pmac-plugins)
* [`pmac plugins:inspect PLUGIN...`](#pmac-pluginsinspect-plugin)
* [`pmac plugins:install PLUGIN...`](#pmac-pluginsinstall-plugin)
* [`pmac plugins:link PLUGIN`](#pmac-pluginslink-plugin)
* [`pmac plugins:uninstall PLUGIN...`](#pmac-pluginsuninstall-plugin)
* [`pmac plugins update`](#pmac-plugins-update)
* [`pmac workspace create`](#pmac-workspace-create)
* [`pmac workspace delete`](#pmac-workspace-delete)

## `pmac autocomplete [SHELL]`

display autocomplete installation instructions

```
USAGE
  $pmac autocomplete [SHELL] [-r]

ARGUMENTS
  SHELL  shell type

FLAGS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

DESCRIPTION
  display autocomplete installation instructions

EXAMPLES
  $pmac autocomplete

  $pmac autocomplete bash

  $pmac autocomplete zsh

  $pmac autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v1.1.1/src/commands/autocomplete/index.ts)_

## `pmac collection create [APIKEY]`

Creates new PM collection

```
USAGE
  $pmac collection create [APIKEY]

ARGUMENTS
  APIKEY  Postman api key

DESCRIPTION
  Creates new PM collection

EXAMPLES
  $pmac collection create
```

## `pmac hello PERSON`

Say hello

```
USAGE
  $pmac hello [PERSON] -f <value>

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

_See code: [dist/commands/hello/index.ts](https://github.com/unicop/pmac/blob/v0.0.0/dist/commands/hello/index.ts)_

## `pmac hello world`

Say hello world

```
USAGE
  $pmac hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ oex hello world
  hello world! (./src/commands/hello/world.ts)
```

## `pmac help [COMMAND]`

Display help forpmac.

```
USAGE
  $pmac help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help forpmac.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.9/src/commands/help.ts)_

## `pmac init [APIKEY]`

Initialpmac environment

```
USAGE
  $pmac init [APIKEY]

ARGUMENTS
  APIKEY  Postman api key

DESCRIPTION
  Initialpmac environment

EXAMPLES
  $pmac init
```

_See code: [dist/commands/init/index.ts](https://github.com/unicop/pmac/blob/v0.0.0/dist/commands/init/index.ts)_

## `pmac plugins`

List installed plugins.

```
USAGE
  $pmac plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $pmac plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.0.11/src/commands/plugins/index.ts)_

## `pmac plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $pmac plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $pmac plugins:inspect myplugin
```

## `pmac plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $pmac plugins:install PLUGIN...

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
  $pmac plugins add

EXAMPLES
  $pmac plugins:install myplugin 

  $pmac plugins:install https://github.com/someuser/someplugin

  $pmac plugins:install someuser/someplugin
```

## `pmac plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $pmac plugins:link PLUGIN

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
  $pmac plugins:link myplugin
```

## `pmac plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $pmac plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $pmac plugins unlink
  $pmac plugins remove
```

## `pmac plugins update`

Update installed plugins.

```
USAGE
  $pmac plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

## `pmac workspace create`

Creates new PM collection

```
USAGE
  $pmac workspace create [-k <value>]

FLAGS
  -k, --api-key=<your PM api key>  Dynamic api key

DESCRIPTION
  Creates new PM collection

EXAMPLES
  $pmac collection create
```

## `pmac workspace delete`

Creates new PM collection

```
USAGE
  $pmac workspace delete [-k <value>]

FLAGS
  -k, --api-key=<your PM api key>  Dynamic api key

DESCRIPTION
  Creates new PM collection

EXAMPLES
  $pmac collection create
```
<!-- commandsstop -->
