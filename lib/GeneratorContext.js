const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')
const spawn = require('cross-spawn')
const spinner = require('./spinner')
const logger = require('./logger')
const SherryError = require('./SherryError')

module.exports = class GeneratorContext {
  constructor(sherry, generator) {
    this.sherry = sherry
    this.generator = generator
    this.spinner = spinner
    this.chalk = chalk
    this.logger = logger
    this.fs = fs
  }

  get pkg() {
    try {
      return require(path.join(this.outDir, 'package.json'))
    } catch (err) {
      return {}
    }
  }

  get answers() {
    return this._answers
  }

  get gitUser() {
    return require('./gitInfo')(this.sherry.opts.mock)
  }

  get outFolder() {
    return path.basename(this.sherry.opts.outDir)
  }

  get outDir() {
    return this.sherry.opts.outDir
  }

  get npmClient() {
    return this.sherry.opts.npmClient
  }

  gitInit() {
    const ps = spawn.sync('git', ['init'], {
      stdio: 'ignore',
      cwd: this.outDir
    })
    if (ps.status === 0) {
      logger.success('Initialized empty Git repository')
    } else {
      logger.debug(`git init failed in ${this.outDir}`)
    }
  }

  npmInstall(opts) {
    return require('./installPackages')(
      Object.assign(
        {
          registry: this.sherry.opts.registry,
          cwd: this.outDir
        },
        opts
      )
    )
  }

  showProjectTips() {
    spinner.stop() // Stop when necessary
    logger.success(`Generated into ${chalk.underline(this.outDir)}`)
  }

  createError(message) {
    return new SherryError(message)
  }
}
