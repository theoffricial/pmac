import glob from 'glob'

export type GlobPromiseOptions = glob.IOptions;
export const globPromise = async (pattern: string, options: glob.IOptions = {}): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    glob(pattern, options, (err, matches) => {
      err ? reject(err) : resolve(matches)
    })
  })
}

export const globMultiPromise = async (
  patterns: string[],
  options: glob.IOptions = {},
): Promise<string[]> => {
  const promises = []
  for (const pattern of patterns) {
    promises.push(globPromise(pattern, options))
  }

  const matchers = await Promise.all(promises)

  return matchers.flat()
}
