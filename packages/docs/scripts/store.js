const Conf = require('conf')

const store = new Conf({
  configName: 'Translate'
})

console.log('Store path:', store.path)

module.exports = store
