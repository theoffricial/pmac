import camelcase from 'camelcase'
// eslint-disable-next-line unicorn/prefer-node-protocol
import path from 'path'
import dotenv from 'dotenv'

import { PMAC_FILE_SYS } from '../../file-system/fs-pmac.constants'
// move to constants
const textPrefix = PMAC_FILE_SYS.PMAC_ENV_VARS.TEXT_ENV_VAR_PREFIX
const secretPrefix = PMAC_FILE_SYS.PMAC_ENV_VARS.SECRET_ENV_VAR_PREFIX

const textEnvVarPrefix = new RegExp(`^${textPrefix}`, 'i')
const secretEnvVarPrefix = new RegExp(`^${secretPrefix}`, 'i')

interface NewmanEnvVar {
    key: string,
    value: string
}

export function configDotEnv(dotEnvRelativePath = '.env') {
  const dotEnvPath = path.resolve('.', dotEnvRelativePath)

  dotenv.config({ path: dotEnvPath })
}

export function buildNewmanEnvVars() {
  console.log(camelcase(process.env.PM_pokemon_Id_Or_Name || ''))
  const entries = Object.entries(process.env as { [key: string]: string })
  const filter = entries.filter(([k]) => textEnvVarPrefix.test(k))
  const newmanEnvVarsFormat = filter.map<NewmanEnvVar>(([envVarName, value]) => {
    let envVarNamePrefixSliced = envVarName.slice(Math.max(0, textPrefix.length))
    // check if variable is secret
    if (secretEnvVarPrefix.test(envVarName)) {
      envVarNamePrefixSliced = envVarName.slice(Math.max(0, secretPrefix.length))
    }

    return {
      key: camelcase(envVarNamePrefixSliced),
      value,
    }
  })
  return newmanEnvVarsFormat
}
