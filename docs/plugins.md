`pmac plugins`
==============

List installed plugins.

* [`pmac plugins`](#pmac-plugins)
* [`pmac plugins:inspect PLUGIN...`](#pmac-pluginsinspect-plugin)
* [`pmac plugins:install PLUGIN...`](#pmac-pluginsinstall-plugin)
* [`pmac plugins:link PLUGIN`](#pmac-pluginslink-plugin)
* [`pmac plugins:uninstall PLUGIN...`](#pmac-pluginsuninstall-plugin)
* [`pmac plugins update`](#pmac-plugins-update)

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
