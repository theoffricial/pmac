# CHANGELOG

## 1.4.0

- Create common tasks for workspaces
- Make `pmac workspace delete` command to work with `Listr2`
- Add a new flag `--workspace-path` for `pmac workspace delete`, for automation support, which can be use like this example: `pmac workspace delete -w ./.pmac/workspaces/personal/test-env_pmacf7367da5e7e34110aaeb956db8b7d777/pmac-workspace.json`.

## 1.3.0

- Refactor `init` and `workspace.create` commands to work with `Listr2`.
- Add new `--name`, `--skip-description`, and `--type` flags for `workspace.create`.

## 1.2.1

- Add reference to `pmac` public roadmap

## 1.2.0

- Add support for `pmac environment update --dot-env-path ./path/to/custom/.env` 
- Add support for `pmac environment update --dot-env-path ./path/to/custom/.env`
- New flags for `pmac collection delete` - `--pm-only` and `--pmac-only`
- New flags for `pmac environment delete` - `--pm-only` and `--pmac-only`
- Both commands are looking for environment variables with prefix of `PMAC_` for text environment variable, and prefix `PMAC_SECRET_` for secret environment variables, and remove the prefix for the actual Postman environment variable, for example the env var `PM_ONE_tWo_THReE=42` will turn to `oneTwoThree: 42 (type text)`. 
- Following the new Postman support for secret type, then you can push these environment to Postman. 

## 1.1.0

- Add support for `pmac collection run --env-var --env-var-path=./path/to/custom/.env`, `pmac` will collect all the .env variables with the prefix of `PMAC_` (case insensitive) and convert them to `camelcase` and remove the `PMAC_` prefix.
For instance, `PMAC_MY_VAR=2` will convert to `myVar: 2` for `newman`/`postman` execution
- Next minor, `pmac` will support new command: `pmac collection update` that will create both `text` and `secret` variable into an existing environment. 

## 1.0.5

- Decouple PMAC workspaces from PM workspaces
  - Means that PMAC is self-managing its workspaces in the code while it is fully integrated with PM workspaces, for self-manage its workspaces' resources (e.g. collection)
  - Workspace resources are similar for both PM and PMAC, it means that for instance, collection.json is equivalent in PMAC and PM.
