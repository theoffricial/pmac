export function environmentPathValidator(testedPath: string): boolean {
  return /.*\/environments\/.*\.postman_environment\.json/.test(testedPath)
}

export function collectionPathValidator(testedPath: string): boolean {
  return /.*\/collections\/.*\.postman_collection\.json/.test(testedPath)
}
