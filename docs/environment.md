`pmac environment`
==================

Creates a new PM environment.

* [`pmac environment create`](#pmac-environment-create)
* [`pmac environment delete`](#pmac-environment-delete)
* [`pmac environment pull`](#pmac-environment-pull)
* [`pmac environment push`](#pmac-environment-push)

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
  -l, --pmac-only  Removes environment only from .pmac, keeps workspace in your PM account (remote)
  -r, --pm-only    Removes environment only from your PM account, keeps workspace in .pmac (repository)

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
