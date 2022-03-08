# CHANGELOG

## 1.1.0

- Add support for `pmac collection run --env-var --env-var-path=./path/to/custom/.env` for .env variables with prefix of `PM_`.

## 1.0.5

- Decouple PMAC workspaces from PM workspaces
  - Means that PMAC is self-managing its workspaces in the code while it is fully integrated with PM workspaces, for self-manage its workspaces' resources (e.g. collection)
  - Workspace resources are similar for both PM and PMAC, it means that for instance, collection.json is equivalent in PMAC and PM.
