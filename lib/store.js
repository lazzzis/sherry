const Conf = require('conf')
const logger = require('./logger')
const { SHERRY_GLOBAL_SCOPE } = require('./env')

const store = new Conf({
  configName: SHERRY_GLOBAL_SCOPE
})

logger.debug('Store path:', store.path)

module.exports = store
