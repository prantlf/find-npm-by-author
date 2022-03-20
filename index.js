
const { readFileSync } = require('fs')
const glob = require('tiny-glob')

exports.findByAuthor = function findByAuthor({ path = 'node_modules', authors = [], homepages = [], repositories = [] }) {
  authors = convertToRegExp(authors)
  homepages = convertToRegExp(homepages)
  repositories = convertToRegExp(repositories)
  return glob(`${path}/**/package.json`, { dot: true, filesOnly: true })
    .then(files => ({
      directories: collectDirs({ files, authors, homepages, repositories })
    }))
}

function convertToRegExp(words) {
  return words.map(word => new RegExp(`\\b${word}\\b`, 'i'))
}

function collectDirs({ files, authors, homepages, repositories }) {
  return files
    .filter(file => checkFile({ file, authors, homepages, repositories }))
    .map(file => file.substr(0, file.length - 13))
}

function checkFile({ file, authors, homepages, repositories }) {
  const content = readFileSync(file, 'utf8')
  const pkg = JSON.parse(content)
  return checkPackage({ pkg, authors, homepages, repositories })
}

function checkPackage({ pkg, authors, homepages, repositories }) {
  const { author, homepage, repository, bugs } = pkg
  return findStrings(authors, [author], 'name') ||
    findStrings(homepages, [homepage], 'url') ||
    findStrings(repositories, [repository, bugs], 'url')
}

function findStrings(exprs, values, prop) {
  return values.some(value =>
    value && exprs.some(regexp => {
      if (typeof value !== 'string') value = value[prop]
      return value && regexp.test(value)
    })
  )
}
