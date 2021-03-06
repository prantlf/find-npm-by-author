# find-npm-by-author

[![Latest version](https://img.shields.io/npm/v/find-npm-by-author)
 ![Dependency status](https://img.shields.io/librariesio/release/npm/find-npm-by-author)
](https://www.npmjs.com/package/find-npm-by-author)

Looks for local NPM packages by their author or URL. Can be used to detect packages of authors, whose work you want to fund, or who you want to avoid.

## Synopsis

Find all packages installed in the local `node_modules` authored by me, or with `prantlf` in the repository URL:

    npx find-npm-by-author -A prantl -R prantlf

And the same programmatically:

```js
import { findByAuthor } from 'find-npm-by-author'
const { directories } = await findByAuthor({ authors: ['prantl'], repositories: ['prantlf'] })
for (const directory of directories) console.log(directory)
```

## Installation

The command-line tool is usually installed globally. The package can be installed locally too for the programmatic usage. You can use your favourite package manager like [NPM], [PNPM] or [Yarn]. Make sure, that you use [Node.js] version 10 or newer:

```sh
npm i find-npm-by-author
pnpm i find-npm-by-author
yarn add find-npm-by-author
```

## Command Line

Paths to directories paths with matching packages will be printed on the console.

    find-npm-by-author [option...]

    Options:
      -A|--author <word>      word to match in the name of the author
      -H|--homepage <word>    word to match in the home page URL
      -R|--repository <word>  word to match in the repository or bugs URL
      -p|--path <path>        path to modules to search (default: node_modules)
      -V|--version            print version number
      -h|--help               print usage instructions

    Words will be matched as expressions with a word boundary, enclosed by \b.
    The arguments can be specified multiple times to try one of several words.

## API

This package exposes the following names exports.

### findByAuthor({ path, authors, homepages, repositories }): result[]

Input parameters are expected as an object with the following properties. At least one of the arrays `authors`, `homepages` or `repositories` must not be empty.

| property       | type       | default          | description                                                 |
|:---------------|:-----------|:-----------------|:------------------------------------------------------------|
| `path`         | `string`   | `'node_modules'` | path to the directory with NPM modules to search            |
| `authors`      | `string[]` | `[]`             | word expressions to match in names of package authors       |
| `homepages`    | `string[]` | `[]`             | word expressions to match in the package home page URL      |
| `repositories` | `string[]` | `[]`             | word expressions to match in package repository or bug URLs |

Output is an object with the following properties:

| property       | type       | description                             |
|:---------------|:-----------|:----------------------------------------|
| `directories`  | `string[]` | directory paths with matching packages  |
| `errors`       | `object[]` | errors from reading or parsing packages |

An error is described by an object with the following properties:

| property  | type     | description                                                               |
|:----------|:---------|:--------------------------------------------------------------------------|
| `error`   | `Error`  | the original error thrown when reading or parsing a package               |
| `file`    | `string` | the path to the file which was processed when the error was thrown        |
| `content` | `string` | the content of the processed file if reading succeeded and parsing failed |

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Lint and test your code.

## License

Copyright (c) 2022 Ferdinand Prantl

Licensed under the MIT license.

[Node.js]: http://nodejs.org/
[NPM]: https://www.npmjs.com/
[PNPM]: https://pnpm.io/
[Yarn]: https://yarnpkg.com/
