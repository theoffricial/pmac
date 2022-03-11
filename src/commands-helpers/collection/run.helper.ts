import { pmacDotEnv } from '../../file-system'
interface NewmanEnvVar {
    key: string,
    value: string
}

export function buildNewmanEnvVars(dotEnvRelativePath?: string) {
  return pmacDotEnv.buildPMACDotEnvVars(dotEnvRelativePath).map(([envVarName, value, _type]) => ({
    key: envVarName,
    value,
  } as NewmanEnvVar))
}
