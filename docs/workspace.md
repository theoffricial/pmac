`pmac workspace`
================

Creates new PMAC collection

* [`pmac workspace create`](#pmac-workspace-create)
* [`pmac workspace delete`](#pmac-workspace-delete)
* [`pmac workspace fetch`](#pmac-workspace-fetch)
* [`pmac workspace pull`](#pmac-workspace-pull)
* [`pmac workspace pull-all`](#pmac-workspace-pull-all)
* [`pmac workspace push`](#pmac-workspace-push)

## `pmac workspace create`

Creates new PMAC collection

```
USAGE
  $ pmac workspace create [-k <value>] [-n <value>] [-t personal|team] [-s]

FLAGS
  -k, --api-key=<your PM api key>  Dynamic api key
  -n, --name=<name>                Sets the workspace name without need for stdin question
  -s, --skip-description           Skips questioning for workspace description and set it to an empty string.
  -t, --type=<type>                Sets the workspace type without need for stdin question.

DESCRIPTION
  Creates new PMAC collection

EXAMPLES
  $pmac collection create
```

## `pmac workspace delete`

Deletes a workspace, allowing deleting a workspace from your Postman account, from pmac (your repo), or both. 

```
USAGE
  $ pmac workspace delete [-r] [-l] [-w <value>]

FLAGS
  -l, --pmac-only                                                 Deletes only pmac workspace (your repo), But do not
                                                                  delete the workspace from your Postman account.
  -r, --pm-only                                                   Deletes a workspace only from your Postman account,
                                                                  But do not delete the workspace from pmac (your repo).
  -w, --workspace-path=relative/path/to/your/pmac-workspace.json

DESCRIPTION
  Deletes a workspace, allowing deleting a workspace from your Postman account, from pmac (your repo), or both.

  By default deletes both, for more information, use --help.

EXAMPLES
  $ pmac workspace delete

  $ pmac workspace delete -w ./.pmac/workspaces/personal/test-env_pmacf7367da5e7e34110aaeb956db8b7d777/pmac-workspace.json

  $ pmac workspace delete -w ./.pmac/workspaces/personal/test-env_pmacf7367da5e7e34110aaeb956db8b7d777/pmac-workspace.json --pmac-only

  $ pmac workspace delete --pm-only
```

## `pmac workspace fetch`

Fetches all pulled workspaces up-to-date.

```
USAGE
  $ pmac workspace fetch

DESCRIPTION
  Fetches all pulled workspaces up-to-date.

EXAMPLES
  $ pmac workspace fetch
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

## `pmac workspace pull-all`

Pulls all workspaces within your account.

```
USAGE
  $ pmac workspace pull-all

DESCRIPTION
  Pulls all workspaces within your account.

EXAMPLES
  $pmac workspace pull-whole-account
```

## `pmac workspace push`

Fetches all pulled workspaces up-to-date.

```
USAGE
  $ pmac workspace push

DESCRIPTION
  Fetches all pulled workspaces up-to-date.

EXAMPLES
  $pmac workspace fetch
```
