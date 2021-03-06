#!/usr/bin/env node
const cac = require('cac').default
const SherryError = require('../lib/SherryError')
const parseGenerator = require('../lib/parseGenerator')
const inquirer = require('inquirer')

const cli = cac()

const sherry = require('../lib/index')()

const plugins = [
  { name: 'view-generators', path: require('path').resolve(__dirname, '../lib/plugins/commands/view-generators') }
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
      const [generator, outDir] = input
      if (!outDir) {
        const { continueGenerate } = await inquirer.prompt({
          name: 'continueGenerate',
          message: 'Are you sure you want to create a new project in the current directory?',
          choices: ['Y', 'N'],
          type: 'list',
          default: 'Y'
        })
        if (continueGenerate === 'N') {
          return console.log(`Cancelled\n`)
        }
      }
      const options = Object.assign(
        {
          generator,
          outDir: outDir || '.',
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
  .option('yes', {
    desc: 'Use the default options',
    alias: 'y'
  })
  .option('registry', {
    desc: 'Use a custom registry for npm and yarn',
    type: 'string'
  })
  .option('git-clone', {
    desc: 'Clone repository instead of archive download',
    type: 'boolean',
    alias: 'c'
  })
  .option('git-server', {
    desc: 'Use a custom git server for pulling generators in git',
    type: 'string'
  })

cli.command('set-alias', 'Set an alias for a generator path', input => {
  const store = require('../lib/store')
  const { escapeDots } = require('../lib/utils/common')
  const logger = require('../lib/logger')
  const chalk = require('chalk')
  const path = require('path')
  const cwd = process.cwd()

  const name = input[0]
  let value = input[1]

  if (!name) {
    return console.log(`\n  Usage: ${chalk.cyan('sherry set-alias <alias> <generator-path>')}${chalk.gray('[Default: cwd]')}\n`)
  }

  if (!value) {
    value = cwd
  }

  if (!path.isAbsolute(value)) {
    value = path.resolve(cwd, value)
  }

  if (!require('fs').existsSync(value)) {
    return console.log(`  Warn: generator ${chalk.cyan(value)} doesn't exist`)
  }

  const generator = parseGenerator(value)

  store.set(`alias.${escapeDots(name)}`, value)
  store.set(`generators.${generator.hash}`, generator)
  logger.success(`Added alias '${name}'`)
})

cli.command('get-alias', 'Get the generator for an alias', input => {
  const store = require('../lib/store')
  const { escapeDots } = require('../lib/utils/common')

  console.log(store.get(`alias.${escapeDots(input[0])}`))
})

cli.command('remove-alias', 'Remove the generator for an alias', input => {
  const store = require('../lib/store')
  const { escapeDots } = require('../lib/utils/common')
  const chalk = require('chalk')
  const logger = require('../lib/logger')

  const [alias] = input
  const key = `alias.${escapeDots(alias)}`
  const target = store.get(key)
  if (!target) {
    return console.log(`  Warn: generator alias ${chalk.cyan(alias)} doesn't exist`)
  }

  store.delete(key)
  logger.success(`Deleted alias '${alias}'`)
})

cli.command('view-cache', 'Display currentcache', input => {
  const store = require('../lib/store')

  console.log(store.store)
})

cli.on('error', error => {
  return require('../lib/index').handleError(error)
})

cli.parse()
