const downloadUrl = require('download')
const gitclone = require('git-clone')
const logger = require('./logger')
const rm = require('rimraf').sync

/**
 * Expose `download`.
 */

module.exports = download

/**
 * Download `repo` to `dest` and callback `fn(err)`.
 *
 * @param {String} repo
 * @param {String} dest
 * @param {Object} opts
 * @param {Function} fn
 */

function download (repo, dest, opts, fn) {
  console.log(
    `
    ${repo}
    `
  )
  if (typeof opts === 'function') {
    fn = opts
    opts = null
  }
  opts = opts || {}
  const clone = opts.clone || false
  const gitServer = opts.gitServer || false

  if (gitServer) {
    repo = normalize(`direct:${gitServer}${clone ? ':' : '/'}${repo}`, clone)
  } else {
    repo = normalize(repo, clone)
  }

  logger.debug('repo', repo)

  if (clone) {
    gitclone(repo.url, dest, { checkout: repo.checkout, shallow: repo.checkout === 'master' }, function (err) {
      if (err === undefined) {
        rm(dest + '/.git')
        fn()
      } else {
        fn(err)
      }
    })
  } else {
    downloadUrl(repo.url, dest, { extract: true, strip: 1, mode: '666', headers: { accept: 'application/zip' } })
      .then(function (data) {
        fn()
      })
      .catch(function (err) {
        fn(err)
      })
  }
}

/**
 * Normalize a repo string.
 *
 * @param {String} repo
 * @return {Object}
 */

function normalize (repo, clone) {
  let regex = /^(?:(direct):([^#]+)(?:#(.+))?)$/
  let match = regex.exec(repo)

  if (match) {
    let url = match[2]
    const checkout = match[3] || 'master'

    if (clone) {
      url = url.replace(/^(f|ht)tps?:\/\//, '')
      url = 'git@' + url + '.git'
    }
    return {
      type: 'direct',
      url: url,
      checkout: checkout
    }
  } else {
    regex = /^(?:(github|gitlab|bitbucket):)?(?:(.+):)?([^\/]+)\/([^#]+)(?:#(.+))?$/
    match = regex.exec(repo)
    let type = match[1] || 'github'
    let origin = match[2] || null
    let owner = match[3]
    let name = match[4]
    let checkout = match[5] || 'master'

    if (origin == null) {
      if (type === 'github')
        origin = 'github.com'
      else if (type === 'gitlab')
        origin = 'gitlab.com'
      else if (type === 'bitbucket')
        origin = 'bitbucket.com'
    }

    const nRepo = {
      type: type,
      origin: origin,
      owner: owner,
      name: name,
      checkout: checkout
    }

    nRepo.url = getUrl(nRepo, clone)
    return nRepo
  }
}

/**
 * Adds protocol to url in none specified
 *
 * @param {String} url
 * @return {String}
 */

function addProtocol (origin, clone) {
  if (!/^(f|ht)tps?:\/\//i.test(origin)) {
    if (clone)
      origin = 'git@' + origin
    else
      origin = 'https://' + origin
  }

  return origin
}

/**
 * Return a zip or git url for a given `repo`.
 *
 * @param {Object} repo
 * @return {String}
 */

function getUrl (repo, clone) {
  let url

  // Get origin with protocol and add trailing slash or colon (for ssh)
  let origin = addProtocol(repo.origin, clone)
  if (/^git\@/i.test(origin))
    origin = origin + ':'
  else
    origin = origin + '/'

  // Build url
  if (clone) {
    url = origin + repo.owner + '/' + repo.name + '.git'
  } else {
    if (repo.type === 'github')
      url = origin + repo.owner + '/' + repo.name + '/archive/' + repo.checkout + '.zip'
    else if (repo.type === 'gitlab')
      url = origin + repo.owner + '/' + repo.name + '/repository/archive.zip?ref=' + repo.checkout
    else if (repo.type === 'bitbucket')
      url = origin + repo.owner + '/' + repo.name + '/get/' + repo.checkout + '.zip'
  }

  return url
}
