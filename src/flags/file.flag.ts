import { flags } from '@oclif/command'
// eslint-disable-next-line unicorn/prefer-node-protocol
import fs from 'fs'
// eslint-disable-next-line unicorn/prefer-node-protocol
import path from 'path'
// import { CLIError, error } from '@oclif/errors'

export const FileCompletion: flags.ICompletion = {
  skipCache: true,

  options: async ctx => {
    console.log(ctx)
    const fsDirents = fs.readdirSync(path.resolve('.'), { withFileTypes: true })
    const filesOnly = fsDirents.filter(d => d.isFile())
    // const remotes = getGitRemotes(configRemote())
    return filesOnly.map(dirent => dirent.name)
  },
}

export const file = flags.build({
  //   char: 'e',
  completion: FileCompletion,
  description: 'file git remote of app to use',
  // default: ({ options, flags }) => {
  //   return ''
  //   // const envApp = process.env.HEROKU_APP
  //   // if (envApp) return envApp
  //   // const gitRemotes = getGitRemotes(flags.remote || configRemote())
  //   // if (gitRemotes.length === 1) return gitRemotes[0].app
  //   // if (flags.remote && gitRemotes.length === 0) {
  //   //   error(`remote ${flags.remote} not found in git remotes`)
  //   // }

  //   // if (gitRemotes.length > 1 && options.required) {
  //   //   throw new MultipleRemotesError(gitRemotes)
  //   // }
  // },
})
