import Hello from '../../../src/commands/hello/index'
describe('hello', () => {
  it('should say hello when using --from flag and specified person', async () => {
    const spy = jest.spyOn(process.stdout, 'write')
    await Hello.run(['-f=ofri', 'yotam'])
    expect(spy).toHaveBeenCalledWith('hello yotam from ofri! (./src/commands/hello/index.ts)\n')
  })

  it('should fail when no person to say hello to specified', async () => {
    await expect(new Promise((resolve, reject) => {
      setTimeout(() => reject(new Error('no reason')), 1000)
      Hello.run([]).then(() => resolve(2))
    })).rejects.toThrow()
  })
})
