/* eslint-disable unicorn/no-process-exit */
/* eslint-disable no-process-exit */

import { PmacConfigurationManager } from '../../file-system'

export default function pmacConfigLoader(): { apiKey?: string } {
  const config = new PmacConfigurationManager()

  config.exists()
  if (!config.exists()) {
    console.error("pmac not initialized, please run 'pmac init'.")
    process.exit(1)
  }

  if (!config.isPrivateExists()) {
    console.error("pmac not initialized correctly, please run 'pmac init'.")
    process.exit(1)
  }

  const { apiKey } = config.getPrivate()

  try {
    return { apiKey }
  } catch (error) {
    console.error('pmac configuration is invalid.', error)
    throw error
  }
}
