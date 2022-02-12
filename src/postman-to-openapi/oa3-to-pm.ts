import type { OpenApiToPostmanv2Input } from 'openapi-to-postmanv2'
import converter from 'openapi-to-postmanv2'

// const converter = require('openapi-to-postmanv2')
import { PostmanCollection } from '../postman/api/types/collection.types'
// import { getNewCollectionItemsFromOpenAPI } from "./lib/update-collection/update-collection";
converter
export async function convertOA3toPMPromise(
  input: OpenApiToPostmanv2Input, // converter.OA3ToPMInputOptions,
  options?: any, // converter.OA3ToPMOptions
): Promise<PostmanCollection> {
  return new Promise((resolve, reject) => {
    converter.convert(input, options, (error: any, conversionResult: any) => {
      if (error) {
        reject(error)
      } else if (conversionResult.result) {
        resolve(conversionResult.output[0].data)
      } else {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject({ error, conversionResult, message: 'No result returned.' })
      }
    })
  })
}
