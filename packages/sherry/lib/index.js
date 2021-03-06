const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')
const downloadGitRepo = require('./downloadGitRepo')
const resolveFrom = require('resolve-from')
const loadConfig = require('./loadConfig')
const paths = require('./paths')
const spinner = require('./spinner')
const BaseGeneratorContext = require('./GeneratorContext')
const installPackages = require('./installPackages')
const logger = require('./logger')
const isLocalPath = require('./utils/isLocalPath')
const SherryError = require('./SherryError')
const parseGenerator = require('./parseGenerator')
const updateCheck = require('./updateCheck')
const store = require('./store')
const pluginAPI = require('./PluginAPI')

class Sherry {
  /**
   * Create an instance of Sherry
   * @param {Object} opts
   */
  constructor(opts) {
    this.logger = logger
    logger.setOptions(
      process.argv.includes('--debug') || process.argv.includes('--verbose')
        ? 4
        : 1
    )
    if (opts) {
      this.setOptions(opts)
    }
  }

  setCLI(cli) {
    this.cli = cli
    this.pluginAPI = new pluginAPI(this)
  }

  setOptions(opts) {
    this.opts = Object.assign({}, opts)
    this.opts.outDir = path.resolve(this.opts.outDir)
    this.opts.npmClient = installPackages.setNpmClient(this.opts.npmClient)
    this.logger = logger
    logger.setOptions({
      logLevel:
        typeof this.opts.logLevel === 'number'
          ? this.opts.logLevel
          : this.opts.debug || process.argv.includes('--debug') || process.argv.includes('--verbose')
          ? 4
            : this.opts.quiet
              ? 1
              : 3
    })

    this.parsedGenerator = parseGenerator(this.opts.generator)
    logger.debug('parsedGenerator', this.parsedGenerator)
    // Sub generator can only be used in an existing
    if (this.parsedGenerator.subGenerator) {
      logger.debug(
        `Setting out directory to process.cwd() since it's a sub generator`
      )
      this.opts.outDir = process.cwd()
    }
    return this
  }

  /**
   * Run the generator.
   */
  async run(generator, parent) {
    generator = generator || this.parsedGenerator

    if (generator.type === 'repo') {
      await ensureRepo(generator, this.opts)
    } else if (generator.type === 'npm') {
      await ensurePackage(generator, this.opts)
    } else if (generator.type === 'local') {
      await ensureLocal(generator)
    }

    const loaded = await loadConfig(generator.path)
    const config = loaded.path
      ? loaded.data
      : require(path.join(__dirname, 'sherry-config.fallback.js'))

    // Only run following code for root generator
    if (!parent) {
      if (this.opts.updateCheck) {
        updateCheck({
          generator,
          checkGenerator:
            config.updateCheck !== false && generator.type === 'npm',
          // Don't show the notifier after updated the generator
          // Since the notifier is for the older version
          showNotifier: !this.opts.update
        })
      }
      // Keep the generator info
      store.set(`generators.${generator.hash}`, generator)
    }

    if (generator.subGenerator) {
      // TODO: remove `config.generators` support, you should use `subGenerators` instead
      const subGenerators = config.subGenerators || config.generators
      const subGenerator =
        subGenerators &&
        subGenerators.find(g => g.name === generator.subGenerator)
      if (subGenerator) {
        // TODO: remove `subGenerator.from` support, you should use `subGenerator.generator` instead
        let generatorPath = subGenerator.generator || subGenerator.from
        generatorPath = isLocalPath(generatorPath)
          ? path.resolve(generator.path, generatorPath)
          : resolveFrom(generator.path, generatorPath)
        return this.run(parseGenerator(generatorPath), generator)
      }
      throw new SherryError(
        `No such sub generator in generator ${generator.path}`
      )
    }

    await this.runGenerator(generator, config)
  }

  async runGenerator(generator, config) {
    if (config.description) {
      logger.status('green', 'Generator', config.description)
    }

    const GeneratorContext = this.opts.getContext
      ? this.opts.getContext(BaseGeneratorContext)
      : BaseGeneratorContext
    const generatorContext = new GeneratorContext(this, generator)
    this.generatorContext = generatorContext

    if (typeof config.prepare === 'function') {
      await config.prepare.call(generatorContext, generatorContext)
    }

    if (config.prompts) {
      await require('./runPrompts')(config, generatorContext)
    }

    if (config.actions) {
      await require('./runActions')(config, generatorContext)
    }

    if (!this.opts.mock && config.completed) {
      await config.completed.call(generatorContext, generatorContext)
    }
  }

  applyPlugins(plugins) {
    for (const {name, path} of plugins) {
      logger.debug(`Apply plugin: ${name}`)
      const pluginFn = require(path)
      pluginFn(this.pluginAPI)
    }
  }
}

/**
 * Create an instance of Sherry
 * @param {Object} opts
 */
module.exports = opts => new Sherry(opts)

module.exports.mock = require('./mock')

module.exports.handleError = require('./handleError')

/**
 *  Download git repo
 * @param {string} repo
 * @param {string} target
 * @param {Object=} opts
 */
function downloadRepo(repo, target, opts) {
  return fs.remove(target).then(
    () =>
      new Promise((resolve, reject) => {
        downloadGitRepo(repo, target, opts, err => {
          if (err) return reject(err)
          resolve()
        })
      })
  )
}

/**
 * Ensure packages are installed in a generator
 * In most cases this is used for `repo` generators
 * @param {Object} generator
 * @param {Object} options
 */
async function ensureRepo(generator, { update, gitClone, registry, gitServer }) {
  if (!update && (await fs.pathExists(generator.path))) {
    return
  }

  // Download repo
  spinner.start('Downloading repo')
  try {
    await downloadRepo(generator.slug, generator.path, { clone: gitClone, gitServer })
    spinner.stop()
    logger.success('Downloaded repo')
  } catch (err) {
    let message = err.message
    if (err.host && err.path) {
      message += '\n' + err.host + err.path
    }
    throw new SherryError(message)
  }
  // Only try to install dependencies for real generator
  const [hasConfig, hasPackageJson] = await Promise.all([
    loadConfig.hasConfig(generator.path),
    fs.pathExists(path.join(generator.path, 'package.json'))
  ])

  if (hasConfig && hasPackageJson) {
    await installPackages({
      cwd: generator.path,
      registry,
      installArgs: ['--production']
    })
  }
}

async function ensureLocal(generator) {
  const exists = await fs.pathExists(generator.path)

  if (!exists) {
    throw new SherryError(
      `Directory ${chalk.underline(generator.path)} does not exist`
    )
  }
}

async function ensurePackage(generator, { update, registry }) {
  const installPath = path.join(paths.packagePath, generator.hash)

  if (update || !(await fs.pathExists(generator.path))) {
    await fs.ensureDir(installPath)
    await fs.writeFile(
      path.join(installPath, 'package.json'),
      JSON.stringify({
        private: true
      }),
      'utf8'
    )
    logger.debug('Installing generator at', installPath)
    await installPackages({
      cwd: installPath,
      registry,
      packages: [`${generator.name}@${generator.version || 'latest'}`]
    })
  }
}

// async function ensureOutDir(outDir, force) {
//   if (force) return
//   if (!(await fs.pathExists(outDir))) return

//   const files = await fs.readdir(outDir)
//   if (files.length === 0) return

//   const answers = await require('inquirer').prompt([{
//     name: 'force',
//     message: `Directory ${chalk.underline(outDir)} already exists, do you want to continue`,
//     type: 'confirm',
//     default: false
//   }])
//   if (!answers.force) {
//     throw new SherryError(`Aborted`)
//   }
// }
