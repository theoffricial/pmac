// init
// check if pmac initialized

// eslint-disable-next-line unicorn/prefer-node-protocol
import fsPromises from 'fs/promises'
// eslint-disable-next-line unicorn/prefer-node-protocol
import fs from 'fs'
import { createPMACPrivateConfig } from './fs-private-manager'
import { addPMACPrivateIgnoreRules } from './fs-scm-manager'
import { PMAC_FILE_SYS } from './fs-pmac.constants'

interface InitOptions {
    overwrite?: boolean
}

export async function init(options?: InitOptions) {
  await createMainDir(options)
  await Promise.all([
    createWorkspacesDir(),
    createPrivateDir(),
  ])

  await Promise.all([
    createTypesWorkspacesDir(),
    createPMACPrivateConfig({ apiKey: '' }),
  ])

  // Add privates to git ignore
  await addPMACPrivateIgnoreRules()
}

async function createMainDir(options?: InitOptions) {
  const { path } = PMAC_FILE_SYS.MAIN_DIR
  if (options?.overwrite) {
    await fsPromises.rm(path, { recursive: true, force: true })
  } else if (isMainDirExists()) {
    throw new Error('pmac already exists')
  }

  await fsPromises.mkdir(path)
}

// workspaces
async function createWorkspacesDir() {
  const { path } = PMAC_FILE_SYS.MAIN_DIR.WORKSPACES_DIR
  await fsPromises.mkdir(path)
}

async function createTypesWorkspacesDir() {
  const { path: personalPath } = PMAC_FILE_SYS.MAIN_DIR.WORKSPACES_DIR.PERSONAL
  const { path: teamPath } = PMAC_FILE_SYS.MAIN_DIR.WORKSPACES_DIR.TEAM
  await Promise.all([
    fsPromises.mkdir(personalPath),
    fsPromises.mkdir(teamPath),
  ])
}

// private
async function createPrivateDir() {
  const { path } = PMAC_FILE_SYS.MAIN_DIR.PRIVATE_DIR
  await fsPromises.mkdir(path)
}

export function isMainDirExists() {
  return fs.existsSync(PMAC_FILE_SYS.MAIN_DIR.path)
}
