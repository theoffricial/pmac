const pmakRegex = /PMAK-[\da-z]{24}-[\da-z]{34}/
export function pmakValidator(apiKey: string): boolean {
  return pmakRegex.test(apiKey)
}
