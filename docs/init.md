`pmac init`
===========

Initial pmac environment

* [`pmac init`](#pmac-init)

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
