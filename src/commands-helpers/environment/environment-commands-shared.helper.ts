import { pmacDotEnv } from '../../file-system'
import { PostmanEnvironmentValue } from '../../postman/api/types'

export function buildPMACEnvironmentValues(dotEnvRelativePath?: string) {
  const envVars = pmacDotEnv.buildPMACDotEnvVars(dotEnvRelativePath)

  return envVars.map(([envVarName, value, type]) => ({
    enabled: true,
    key: envVarName,
    type,
    value,
  } as PostmanEnvironmentValue))
}
