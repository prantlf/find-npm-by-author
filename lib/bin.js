#!/usr/bin/env node

function usage () {
  console.log(`Looks for local NPM packages by their author or URL

Usage: find-npm-by-author [option...]'))}

Options:
  -A|--author <word>      word to match in the name of the author
  -H|--homepage <word>    word to match in the home page URL
  -R|--repository <word>  word to match in the repository or bugs URL
  -p|--path <path>        path to modules to search (default: node_modules)
  -V|--version            print version number
  -h|--help               print usage instructions

Words will be matched as expressions with a word boundary, enclosed by \\b.
The arguments can be specified multiple times to try one of several words.

Examples:
  find-npm-by-author -N prantl -R prantlf`)
  process.exit(0)
}

const args = process.argv
if (args.length < 3) usage()

const authors = []
const homepages = []
const repositories = []
let path = 'node_modules'

for (let i = 2, l = args.length; i < l; ++i) {
  const arg = args[i]
  const match = /^(?:-|--)([a-zA-Z]+)$/.exec(arg)
  if (match) {
    const flag = match[1]
    switch (flag) {
      case 'A': case 'author':
        authors.push(args[++i])
        continue
      case 'H': case 'homepage':
        homepages.push(args[++i])
        continue
      case 'R': case 'repository':
        repositories.push(args[++i])
        continue
      case 'p': case 'path':
        path = args[++i]
        continue
      case 'V': case 'version':
        console.log(require('../package.json').version)
        process.exit(0)
        break
      case 'h': case 'help':
        usage()
    }
    handleError(`unknown option: "${match[0]}"`)
  }
}

if (!(authors.length || homepages.length || repositories.length))
  handleError('no authors, homepages or repositories specified')

const { existsSync } = require('fs')
if (!existsSync(path)) handleError(`"${path}" not found`)

const { findByAuthor } = require('.')
findByAuthor({ path, authors, homepages, repositories })
  .then(printPackages)
  .catch(handleError)

function printPackages({ directories, errors }) {
  for (const { error, file } of errors) console.error(`${error.message} in "${file}"`)
  for (const directory of directories) console.log(directory)
}

function handleError(error) {
  console.error(error)
  process.exit(1)
}
