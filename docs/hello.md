`pmac hello`
============

Say hello

* [`pmac hello PERSON`](#pmac-hello-person)
* [`pmac hello world`](#pmac-hello-world)

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
