import glob from 'glob'

export const globPromise = async (pattern: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    glob(pattern, (err, matches) => {
      err ? reject(err) : resolve(matches)
    })
  })
}

export const globMultiPromise = async (
  patterns: string[],
): Promise<string[]> => {
  const promises = []
  for (const pattern of patterns) {
    promises.push(globPromise(pattern))
  }

  const matchers = await Promise.all(promises)

  return matchers.flat()
}
