const getGenerators = require('./getGenerators')
const printGenerators = require('./printGenerators')

module.exports = api => {
  api.registerCommand(cli => {
    cli.command('list-generators', 'List installed generators', async () => {
      const generators = await getGenerators()
      return printGenerators(generators)
    })
  })
}
