import { PMAC_FILE_SYS } from './fs-pmac.constants'

const PMAC_NOT_FOUND_ERROR = new Error(
  `${PMAC_FILE_SYS.PKG_NAME} not initialized, please use 'pmac init' to start using pmac.`,
)

const PMAC_WORKSPACE_ALREADY_EXISTS_ERROR = new Error(
  `${PMAC_FILE_SYS.PKG_NAME} Workspace name already exists.`,
)

const PMAC_W_RESOURCE_ALREADY_EXISTS_ERROR = new Error(
  `${PMAC_FILE_SYS.PKG_NAME} resource already exists.`,
)

const PMAC_PRIVATE_ALREADY_EXISTS_ERROR = new Error(
  `${PMAC_FILE_SYS.PKG_NAME} private configuration already exists.`,
)

const PMAC_ALREADY_INITIALIZED_ERROR = new Error(
  `${PMAC_FILE_SYS.PKG_NAME} already initialized, you can turn 'force' flag to overwrite existing configuration.`,
)
