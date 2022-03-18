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
  -k, --api-key=<value>  (required) Postman api key, .pmac need it to integrate with your PM account, if you have not
                         generated one yet,
                         please generate it at: https://learning.postman.com/docs/developer/intro-api/

DESCRIPTION
  Initial pmac environment

EXAMPLES
  $pmac init --api-key "your-pm-api-key"

  $pmac init -k "your-pm-api-key"
```

_See code: [dist/src/commands/init/index.ts](https://github.com/postman-as-code/pmac/blob/v1.3.0/dist/src/commands/init/index.ts)_
