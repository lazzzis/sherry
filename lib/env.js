let SHERRY_GLOBAL_SCOPE = process.env.SHERRY_GLOBAL_SCOPE || 'sherry'
let SHERRY_MODULE_PREFIX = process.env.SHERRY_MODULE_PREFIX || 'sherry'
let SHERRY_CONFIG_FILE = process.env.SHERRY_CONFIG_FILE || 'sherry-config'

if (process.env.SAO) {
  SHERRY_GLOBAL_SCOPE = 'sao'
  SHERRY_MODULE_PREFIX = 'sao'
  SHERRY_CONFIG_FILE = 'saofile'
}

module.exports = {
  SHERRY_GLOBAL_SCOPE,
  SHERRY_MODULE_PREFIX,
  SHERRY_CONFIG_FILE
}
