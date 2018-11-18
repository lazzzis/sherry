let SAO_GLOBAL_SCOPE = process.env.SAO_GLOBAL_SCOPE || 'sherry'
let SAO_MODULE_PREFIX = process.env.SAO_MODULE_PREFIX || 'sherry'
let SAO_CONFIG_FILE = process.env.SAO_CONFIG_FILE || 'sherry-config'

if (process.env.SAO) {
  SAO_GLOBAL_SCOPE = 'sao'
  SAO_MODULE_PREFIX = 'sao'
  SAO_CONFIG_FILE = 'saofile'
}

module.exports = {
  SAO_GLOBAL_SCOPE,
  SAO_MODULE_PREFIX,
  SAO_CONFIG_FILE
}
