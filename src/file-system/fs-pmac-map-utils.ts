import { v4 as uuid } from 'uuid'
import { PMAC_FILE_SYS } from './fs-pmac.constants'

export function generatePMACuuid() {
  return `${PMAC_FILE_SYS.PKG_NAME}${uuid().replace(/-/g, '')}`
}
