// eslint-disable-next-line unicorn/prefer-node-protocol
import { pmacFsUtils } from './fs-utils'
import { PMAC_FILE_SYS } from './fs-pmac.constants'

const { MAIN_DIR: { PRIVATE_DIR } } = PMAC_FILE_SYS

interface PMACPrivateConfig {
    apiKey?: string;
}

interface CreatePMACPrivateOptions {
    update?: boolean;
}

export async function createPMACPrivateConfig(config: PMACPrivateConfig, options?: CreatePMACPrivateOptions) {
  const { path } = PRIVATE_DIR.CONFIG_FILE
  let currentConfig: PMACPrivateConfig = {}

  if (options?.update) {
    currentConfig = await pmacFsUtils.readJsonFile<PMACPrivateConfig>(path).catch(error => ({}))
  }

  const contentToWrite: PMACPrivateConfig = {
    ...currentConfig,
    ...config,
  }

  await pmacFsUtils.writeJsonFile<PMACPrivateConfig>(path, contentToWrite)
}

export async function getPrivateConfig(): Promise<PMACPrivateConfig> {
  const { path } = PRIVATE_DIR.CONFIG_FILE

  return pmacFsUtils.readJsonFile<PMACPrivateConfig>(path).catch(error => {
    return {}
  })
}

// TODO: Add private user pmac here
