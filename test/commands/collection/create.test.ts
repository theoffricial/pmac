import { expect, test } from '@oclif/test'

jest.setTimeout(30_000)

describe.skip('collection.create', () => {
  test
  .stdout()
  .command([
    'collection:create',
    // 'create',
    '-w=.pmac/workspaces/personal/MVP_id_f5dab15c-f3cd-4bb7-8e23-5d39218f7074/',
    // eslint-disable-next-line unicorn/prefer-module
    `-o=${__dirname}/pokemon.openapi.yml`,
  ], { reset: true })
  .it('runs hello cmd', ctx => {
    console.log('sd')
    expect(ctx.stdout).to.contain('Collection Pokemon API created successfully!\nsd\n')
  })
})
