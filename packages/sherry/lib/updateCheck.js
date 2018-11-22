const path = require('path')
const updateNotifier = require('update-notifier')
const chalk = require('chalk')
const yarnGlobal = require('yarn-global')
const logger = require('./logger')

module.exports = ({ generator, checkGenerator, showNotifier }) => {
  performSelfUpdateCheck()
  if (checkGenerator) {
    performGeneratorUpdateCheck(generator, showNotifier)
  }
}

function performSelfUpdateCheck() {
  const pkg = require('../package')
  const notifier = updateNotifier({ pkg })

  if (notifier.update) {
    process.on('exit', () => {
      logger.warn(
        `Your current version of Sherry is out of date. The latest version is "${
          notifier.update.latest
        }", while you're on "${notifier.update.current}".`
      )
      const isYarn = yarnGlobal.hasDependency('sherry')
      logger.tip(
        `To upgrade Sherry, run the following command:\n${chalk.dim(
          isYarn ? '$ yarn global add sherry' : '$ npm i -g sherry'
        )}`
      )
    })
  }
}

function performGeneratorUpdateCheck(generator, showNotifier) {
  const pkg = require(path.join(generator.path, 'package.json'))

  const notifier = updateNotifier({ pkg })

  if (notifier.update && showNotifier) {
    process.on('exit', () => {
      logger.warn(
        `The generator you were running is out of date. The latest version is "${
          notifier.update.latest
        }", while you're on "${notifier.update.current}".`
      )

      logger.tip(
        `To run the generator with an updated version, run the following command:\n${chalk.dim(
          '$ sherry ' + process.argv.slice(2).join(' ') + ' --update'
        )}`
      )
    })
  }
}
