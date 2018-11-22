const { resolve, relative } = require('path')
const { readFile, writeFile } = require('fs-extra')
const { spawn } = require('child_process')
const globby = require('globby')
const translate = require('./lib/index')
const tildify = require('tildify')
const { splitFileIntoParts } = require('./util')
const store = require('./store')
const hash = require('hash-sum')

const SOURCE_DIR = resolve(__dirname, '../docs/zh')
const SOURCE_FILES = globby.sync('**/*.md', {
  cwd: SOURCE_DIR
}).map(file => resolve(SOURCE_DIR, file))

const TRANSLATION_OPTIONS = {
  source: 'zh-CN',
  target: 'en'
}

function isFileChanged(path, content) {
  const files = store.get(`files`) || {}
  const pathHash = hash(path)
  const contentHash = hash(content)
  if (!files[pathHash]) {
    store.set(`files.${pathHash}`, {
      length: content.length,
      date: new Date().toLocaleString(),
      contentHash: contentHash
    })
  }
  const file = store.get(`files.${pathHash}`)
  return file.contentHash !== contentHash
}

async function serialTranslate(path, source) {
  const sourceLen = source.length
  const parts = splitFileIntoParts(source, 2000)
  let res = ''
  for (let i = 0, l = parts.length; i < l; i++) {
    const part = parts[i]
    console.log(`Translate: ${relative(SOURCE_DIR, path)} (length: ${sourceLen}) (${i + 1}/${l})`)
    try {
      res += await translate({
        sourceLang: TRANSLATION_OPTIONS.source,
        targetLang: TRANSLATION_OPTIONS.target,
        sourceText: part,
      })
      // res += await translate(part)
    } catch (e) {
      console.log(e)
    }
  }
  return res
}


async function start() {
  for (let file of SOURCE_FILES) {
    const content = await readFile(file, 'utf-8')
    const changed = isFileChanged(file, content)
    // if (!changed) {
    //   console.log(`Skip ${relative(SOURCE_DIR, file)}`)
    //   continue
    // }
    let res
    try {
      res = await serialTranslate(file, content)
    } catch (e) {
      throw e
    }
    const target = file.replace('/zh/', '/')
    res = res.replace(/\]\s\(/g, '](')
    writeFile(target, res, 'utf-8')
    await sleep(3000)
  }
}

start()

function sleep(duration) {
  return new Promise(resolve => setTimeout(resolve, duration))
}
