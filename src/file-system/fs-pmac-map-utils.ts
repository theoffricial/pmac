import { v4 as uuid } from 'uuid'
import { PMAC_FILE_SYS } from './fs-pmac.constants'

export function generatePMACuuid() {
  return `${PMAC_FILE_SYS.PKG_NAME}${uuid().replace(/-/g, '')}`
}

export function generateTemporaryPMACuuid() {
  return `${PMAC_FILE_SYS.PMAC_TEMPORARY_ID_PREFIX}${uuid().replace(/-/g, '')}`
}
