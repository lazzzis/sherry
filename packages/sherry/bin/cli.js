#!/usr/bin/env node
const cac = require('cac').default
const SherryError = require('../lib/SherryError')

const cli = cac()

const sherry = require('../lib/index')()

const plugins = [
  { name: 'list-generators', path: require('path').resolve(__dirname, '../lib/plugins/commands/list-generators') }
]

sherry.setCLI(cli)
sherry.applyPlugins(plugins)

cli
  .command(
    '*',
    {
      desc: 'Run a generator',
      alias: 'run'
    },
    async (input, flags) => {
      const options = Object.assign(
        {
          generator: input[0],
          outDir: input[1] || '.',
          updateCheck: true
        },
        flags
      )

      if (!options.generator) {
        return cli.showHelp()
      }

      return sherry.setOptions(options).run()
    }
  )
  .option('npm-client', {
    desc: `Use a specific npm client ('yarn' or 'npm')`,
    type: 'string'
  })
  .option('update', {
    desc: 'Update cached generator',
    type: 'boolean',
    alias: 'u'
  })
  .option('clone', {
    desc: 'Clone repository instead of archive download',
    type: 'boolean',
    alias: 'c'
  })
  .option('yes', {
    desc: 'Use the default options',
    alias: 'y'
  })
  .option('registry', {
    desc: 'Use a custom registry for npm and yarn',
    type: 'string'
  })

cli.command('set-alias', 'Set an alias for a generator path', input => {
  const store = require('../lib/store')
  const { escapeDots } = require('../lib/utils/common')
  const logger = require('../lib/logger')

  const name = input[0]
  const value = input[1]
  if (!name || !value) {
    throw new SherryError(
      `Invalid arguments: sherry set-alias <alias> <generator>`
    )
  }

  store.set(`alias.${escapeDots(name)}`, value)
  logger.success(`Added alias '${name}'`)
})

cli.command('get-alias', 'Get the generator for an alias', input => {
  const store = require('../lib/store')
  const { escapeDots } = require('../lib/utils/common')

  console.log(store.get(`alias.${escapeDots(input[0])}`))
})

cli.on('error', error => {
  return require('../lib/index').handleError(error)
})

cli.parse()