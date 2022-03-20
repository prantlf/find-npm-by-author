
const { readFileSync } = require('fs')
const glob = require('tiny-glob')

exports.findByAuthor = function findByAuthor({ path = 'node_modules', authors = [], homepages = [], repositories = [] }) {
  const errors = []
  authors = convertToRegExp(authors)
  homepages = convertToRegExp(homepages)
  repositories = convertToRegExp(repositories)
  return glob(`${path}/**/package.json`, { dot: true, filesOnly: true })
    .then(files => ({
      directories: collectDirs({ files, authors, homepages, repositories, errors }),
      errors
    }))
}

function convertToRegExp(words) {
  return words.map(word => new RegExp(`\\b${word}\\b`, 'i'))
}

function collectDirs({ files, authors, homepages, repositories, errors }) {
  return files
    .filter(file => checkFile({ file, authors, homepages, repositories, errors }))
    .map(file => file.substr(0, file.length - 13))
}

function checkFile({ file, authors, homepages, repositories, errors }) {
  let content
  try {
    content = readFileSync(file, 'utf8')
    /* c8 ignore next 4 */
  } catch (error) {
    errors.push({ error, file })
    return false
  }
  let pkg
  try {
    pkg = JSON.parse(content)
  } catch (error) {
    errors.push({ error, file, content })
    return false
  }
  try {
    return checkPackage({ pkg, authors, homepages, repositories })
    /* c8 ignore next 4 */
  } catch (error) {
    errors.push({ error, file, content })
    return false
  }
}

function checkPackage({ pkg, authors, homepages, repositories }) {
  const { author, homepage, repository, bugs } = pkg
  return findStrings(authors, [author], 'name') ||
    findStrings(homepages, [homepage], 'url') ||
    findStrings(repositories, [repository, bugs], 'url')
}

function findStrings(regexps, values, property) {
  return values.some(value => {
    if (!value) return false
    if (!Array.isArray(value)) value = [value]
    return value.some(value =>
      value && regexps.some(regexp => {
        if (typeof value !== 'string') value = value[property]
        return value && regexp.test(value)
      })
    )
  })
}
