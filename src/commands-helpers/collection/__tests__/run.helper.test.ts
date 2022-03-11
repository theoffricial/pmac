import { buildNewmanEnvVars } from '../run.helper'
import { createMock } from 'ts-jest-mock'
// eslint-disable-next-line unicorn/prefer-node-protocol
import fs from 'fs'
import { PMAC_FILE_SYS } from '../../../file-system/fs-pmac.constants'
jest.mock('fs', () => {
  return {
    readFileSync: jest.fn(),
  }
})

const { SECRET_ENV_VAR_PREFIX, TEXT_ENV_VAR_PREFIX } = PMAC_FILE_SYS.PMAC_ENV_VARS
describe('run.helper', () => {
  describe(buildNewmanEnvVars.name, () => {
    const mockedFs = createMock(fs)

    it('should build env vars when detects special prefixes', () => {
      mockedFs.readFileSync.mockReturnValueOnce(`
        ${TEXT_ENV_VAR_PREFIX}BLUE=blue-value
        ${SECRET_ENV_VAR_PREFIX}BLUE='secret-blue-value'
      `)

      const result = buildNewmanEnvVars()

      expect(result).toStrictEqual([{
        key: 'blue',
        value: 'blue-value',
      },
      {
        key: 'blue',
        value: 'secret-blue-value',
      }])
    })

    it('should ignore env vars when without pmac unique prefixes', () => {
      mockedFs.readFileSync.mockReturnValueOnce(`
          ${TEXT_ENV_VAR_PREFIX}BLUE=blue-value
          ${SECRET_ENV_VAR_PREFIX}BLUE=secret-blue-value
          ANOTHER_VAR=2
        `)

      const result = buildNewmanEnvVars()

      expect(result).toStrictEqual([{
        key: 'blue',
        value: 'blue-value',
      },
      {
        key: 'blue',
        value: 'secret-blue-value',
      }])
    })
  })
})
