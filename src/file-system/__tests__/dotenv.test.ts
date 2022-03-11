import { buildPMACDotEnvVars } from '../dotenv'
import { createMock } from 'ts-jest-mock'
// eslint-disable-next-line unicorn/prefer-node-protocol
import fs from 'fs'
import { PMAC_FILE_SYS } from '../fs-pmac.constants'
jest.mock('fs', () => {
  return {
    readFileSync: jest.fn(),
  }
})

const { SECRET_ENV_VAR_PREFIX, TEXT_ENV_VAR_PREFIX } = PMAC_FILE_SYS.PMAC_ENV_VARS
describe('dotenv', () => {
  describe(buildPMACDotEnvVars.name, () => {
    const mockedFs = createMock(fs)

    it('should build env vars when detects special prefixes', () => {
      mockedFs.readFileSync.mockReturnValueOnce(`
        ${TEXT_ENV_VAR_PREFIX}BLUE='blue-value',
        ${SECRET_ENV_VAR_PREFIX}BLUE='secret-blue-value'
      `)

      const result = buildPMACDotEnvVars()

      expect(result).toStrictEqual([['blue', "'blue-value',", 'text'], ['blue', 'secret-blue-value', 'secret']])
    })

    it('should ignore env vars when without pmac unique prefixes', () => {
      mockedFs.readFileSync.mockReturnValueOnce(`
          ${TEXT_ENV_VAR_PREFIX}BLUE='blue-value',
          ${SECRET_ENV_VAR_PREFIX}BLUE='secret-blue-value'
          ANOTHER_VAR=2
        `)

      const result = buildPMACDotEnvVars()

      expect(result).toStrictEqual([['blue', "'blue-value',", 'text'], ['blue', 'secret-blue-value', 'secret']])
    })
  })
})
