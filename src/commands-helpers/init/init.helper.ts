import { fsMainManager, fsPrivateManager } from '../../file-system'
import { pmakValidator } from '../../validators'

export interface PmacInitCtx {
    apiKey: string
}

async function postmanApiKeyValidation(ctx: PmacInitCtx) {
  const validApiKey = pmakValidator(ctx.apiKey)

  if (!validApiKey) {
    throw new Error('Invalid Postman API key.')
  }
}

async function pmacFileSystemInitTask(ctx: PmacInitCtx) {
  await fsMainManager.init({ overwrite: true })
}

async function savePostmanApiKeyInPrivateTask(ctx: PmacInitCtx) {
  await fsPrivateManager.createPMACPrivateConfig({ apiKey: ctx.apiKey })
}

export const pmacInitCommandHelper = {
  postmanApiKeyValidation,
  pmacFileSystemInitTask,
  savePostmanApiKeyInPrivateTask,
}
