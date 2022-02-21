import World from '../../../src/commands/hello/world'

describe('hello world', () => {
  it('should say hello world', async () => {
    const spy = jest.spyOn(process.stdout, 'write')
    await World.run([])
    expect(spy).toHaveBeenCalledWith('hello world! (./src/commands/hello/world.ts)\n')
  })
})
