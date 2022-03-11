// eslint-disable-next-line unicorn/prefer-node-protocol
import path from 'path'
import dotenv from 'dotenv'
import camelcase from 'camelcase'

import { PMAC_FILE_SYS } from '.'
import { PostmanEnvironmentValueType } from '../postman/api/types'

const { TEXT_ENV_VAR_PREFIX, SECRET_ENV_VAR_PREFIX } = PMAC_FILE_SYS.PMAC_ENV_VARS
// move to constants
const envVarTypeTextPrefix = TEXT_ENV_VAR_PREFIX
const envVarTypeSecretPrefix = SECRET_ENV_VAR_PREFIX

const textEnvVarPrefix = new RegExp(`^${envVarTypeTextPrefix}`, 'i')
const secretEnvVarPrefix = new RegExp(`^${envVarTypeSecretPrefix}`, 'i')

function configDotEnv(dotEnvRelativePath = '.env') {
  const dotEnvPath = path.resolve('.', dotEnvRelativePath)

  const output = dotenv.config({ path: dotEnvPath })

  if (output.error) {
    throw new Error(`No .env file find at path: ${dotEnvRelativePath}`)
  }
}

/**
 * Build pmac environment variables from `process.env`, depends on configuring dotenv file first.
 * @param dotEnvRelativePath {string?} Relative path to your .env file
 * @returns {[string, string, string][]} Sds
 */
export function buildPMACDotEnvVars(dotEnvRelativePath?: string) {
  configDotEnv(dotEnvRelativePath)
  const entries = Object.entries(process.env as { [key: string]: string })
  const filter = entries.filter(([k]) => textEnvVarPrefix.test(k))
  return filter.map(([envVarName, value]) => {
    let type: PostmanEnvironmentValueType = PostmanEnvironmentValueType.Text

    let envVarNamePrefixSliced = envVarName.slice(Math.max(0, envVarTypeTextPrefix.length))
    // check if variable is secret
    if (secretEnvVarPrefix.test(envVarName)) {
      envVarNamePrefixSliced = envVarName.slice(Math.max(0, envVarTypeSecretPrefix.length))
      type = PostmanEnvironmentValueType.Secret
    }

    return [camelcase(envVarNamePrefixSliced), value, type]
  })
}

