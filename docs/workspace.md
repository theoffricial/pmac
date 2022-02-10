`pmac workspace`
================

Creates new PM collection

* [`pmac workspace create`](#pmac-workspace-create)
* [`pmac workspace delete`](#pmac-workspace-delete)
* [`pmac workspace fetch`](#pmac-workspace-fetch)
* [`pmac workspace pull`](#pmac-workspace-pull)
* [`pmac workspace pull-whole-account`](#pmac-workspace-pull-whole-account)

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

## `pmac workspace fetch`

Fetches all pulled workspaces up-to-date.

```
USAGE
  $ pmac workspace fetch

DESCRIPTION
  Fetches all pulled workspaces up-to-date.

EXAMPLES
  $pmac workspace fetch
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
