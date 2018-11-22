// create package.json and README for packages that don't have one yet

const fs = require('fs')
const path = require('path')
const baseVersion = require('../packages/sherry/package.json').version

const packagesDir = path.resolve(__dirname, '../packages')
const files = fs.readdirSync(packagesDir)

files.forEach(pkg => {
  if (pkg.charAt(0) === '.') return

  const isPlugin = /^sherry-plugin-/.test(pkg)
  const desc = isPlugin
    ? `${pkg.replace('sherry-plugin-', '')} plugin for Sherry`
    : `${pkg} for Sherry`

  const pkgPath = path.join(packagesDir, pkg, `package.json`)

  if (!fs.existsSync(pkgPath)) {
    const json = {
      'name': pkg,
      'version': baseVersion,
      'description': desc,
      'main': 'index.js',
      'publishConfig': {
        'access': 'public'
      },
      'repository': {
        'type': 'git',
        'url': 'git+https://github.com/sherry/sherry.git'
      },
      'keywords': [
        "sherry",
        "generator",
        "ulivz",
        "yeoman",
        "template",
        "scaffold",
        "scaffolding",
        "automation",
        "kirito",
        "simple",
        "easy",
        "workflow"
      ],
      'author': 'ULIVZ <chl814@foxmail.com>',
      'license': 'MIT',
      'bugs': {
        'url': 'https://github.com/sherry/sherry/issues'
      },
      'homepage': `https://github.com/sherry/sherry/packages/${pkg}#readme`
    }
    fs.writeFileSync(pkgPath, JSON.stringify(json, null, 2))
  }

  const readmePath = path.join(packagesDir, pkg, `README.md`)
  if (!fs.existsSync(readmePath)) {
    fs.writeFileSync(readmePath, `# ${pkg}\n\n> ${desc}`)
  }

  const npmIgnorePath = path.join(packagesDir, pkg, `.npmignore`)
  if (!fs.existsSync(npmIgnorePath)) {
    fs.writeFileSync(npmIgnorePath, `__tests__\n__mocks__\n.temp\n*.log`)
  }
})
