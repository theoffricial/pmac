// eslint-disable-next-line unicorn/prefer-node-protocol
import path from 'path'

import { WorkspaceType } from '../postman/api/types/workspace.types'
import packageJson from '../../package.json'

// See folder tree: https://tree.nathanfriend.io/?s=(%27optiFs!(%27fancyE~fullPath!false~trailingSlashE~rootDotE)~N(%27N%27.pmOC3s0persFal0J3G63-L23%20rawU63-K2pmOHo%20pm%20K%20forHrOking69s6J948s6J84mFitor76mock70V0teamCQ0Q2user%22I5U%2C%20such%20aIapi-key0Q-K2A%20general%20Kping%20ofHhe%20PM%20Ocount%27)~versiF!%271%27)*%20%200C*2R%20%23%203workspOe4GR6V65private60**7I%7BTBD%7D8envirFment9collectiFC%5Cn*E!trueFonG-name%5DH%20tIs%20J*%5BKmapLdataNsource!OacQ__5R.jsFU%20LV*...%01VURQONLKJIHGFEC987654320*

// top-level
const PKG_NAME = packageJson.name
const PKG_VERSION = packageJson.version
const WORKING_DIR = path.resolve('.')
const MAIN_DIR_NAME = `.${PKG_NAME}`
const MAIN_DIR_PATH = `${WORKING_DIR}/${MAIN_DIR_NAME}`

// 2nd level
const WORKSPACES_DIR_NAME = 'workspaces'
const WORKSPACES_DIR_PATH = `${MAIN_DIR_PATH}/${WORKSPACES_DIR_NAME}`
const PRIVATE_DIR_NAME = '__private'
const PRIVATE_DIR_PATH = `${MAIN_DIR_PATH}/${PRIVATE_DIR_NAME}`

// private files
const PRIVATE_CONFIG_NAME = '__private.json'
const PRIVATE_CONFIG_PATH = `${PRIVATE_DIR_PATH}/${PRIVATE_CONFIG_NAME}`
const PRIVATE_MAP_NAME = '__private-map.json'
const PRIVATE_MAP_PATH = `${PRIVATE_DIR_PATH}/${PRIVATE_MAP_NAME}`

// workspaces
const P_WORKSPACES_DIR_PATH = `${WORKSPACES_DIR_PATH}/${WorkspaceType.Personal}`
const T_WORKSPACES_DIR_PATH = `${WORKSPACES_DIR_PATH}/${WorkspaceType.Team}`

// Workspace structure constants
// const WORKSPACE_FILE_EXT = '.json'
const WORKSPACE_DATA_FILE_NAME = `${PKG_NAME}-workspace.json`
// const WORKSPACE_MAP_FILE_NAME = 'workspace-map.json'

export const PMAC_FILE_SYS = {
  PKG_NAME,
  PKG_VERSION,
  WORKING_DIR,
  MAIN_DIR: {
    name: MAIN_DIR_NAME,
    path: MAIN_DIR_PATH,
    WORKSPACES_DIR: {
      name: WORKSPACES_DIR_NAME,
      path: WORKSPACES_DIR_PATH,
      PERSONAL: {
        path: P_WORKSPACES_DIR_PATH,
        name: WorkspaceType.Personal,
      },
      TEAM: {
        path: T_WORKSPACES_DIR_PATH,
        name: WorkspaceType.Team,
      },
    },
    PRIVATE_DIR: {
      name: PRIVATE_DIR_NAME,
      path: PRIVATE_DIR_PATH,
      CONFIG_FILE: {
        name: PRIVATE_CONFIG_NAME,
        path: PRIVATE_CONFIG_PATH,
      },
      MAP_FILE: {
        name: PRIVATE_MAP_NAME,
        path: PRIVATE_MAP_PATH,
      },
    },
  },
  PMAC_TEMPORARY_ID_PREFIX: `${PKG_NAME}tmp`,
  ENTITIES_CONVENTIONS: {
    NAME_CONVENTIONS: {
      WORKSPACE_NAME_TO_ID_SEPARATOR: '_',
      WORKSPACE_RESOURCE_NAME_TO_ID_SEPARATOR: '_',
    },
    WORKSPACE_DATA_JSON: {
      name: WORKSPACE_DATA_FILE_NAME,
    },
  },
}
