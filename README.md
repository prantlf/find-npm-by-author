# find-npm-by-author

[![Latest version](https://img.shields.io/npm/v/find-npm-by-author)
 ![Dependency status](https://img.shields.io/librariesio/release/npm/find-npm-by-author)
](https://www.npmjs.com/package/find-npm-by-author)

Looks for local NPM packages by their author or URL. Can be used to detect packages of authors, whose work you want to fund, or who you want to avoid, because they are not reliable.

## Synopsis

Find all packages installed in the local `node_modules` authored by me, or with `prantlf` in the repository URL:

    npx find-npm-by-author -N prantl -R prantlf

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

## Usage

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

Prevent the transpiler to wrap source files that are already wrapped by `define` or `require` as AMD modules:

```js
{
  plugins: ['amd-checker']
}
```

A typical configuration combined with [babel-plugin-module-resolver-standalone] and set within [requirejs-babel7] by default:

```js
{
  plugins: [
    'amd-checker',
    'transform-modules-amd',
    [
      'module-resolver',
      {
        resolvePath: function (sourcePath, currentFile, opts) {
          // Avoid prefixing modules handled by other plugins.
          if (sourcePath.indexOf('!') < 0) {
            return 'es6!' + sourcePath;
          }
        }
      }
    ]
  ]
}
```

Error handling during the transpilation in a RequireJS plugin:

```js
var amdChecker = require('find-npm-by-author')
babel.registerPlugin('amd-checker', amdChecker);

var code;
try {
  code = babel.transform(text, options).code;
} catch (error) {
  if (!(error instanceof amdChecker.AmdDetected)) {
    return onload.error(error);
  }
  code = text;
}
```

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Lint and test your code.

## License

Copyright (c) 2022 Ferdinand Prantl

Licensed under the MIT license.

[Node.js]: http://nodejs.org/
[NPM]: https://www.npmjs.com/
[PNPM]: https://pnpm.io/
[Yarn]: https://yarnpkg.com/
[RequireJS]: https://requirejs.org/
[Babel]: http://babeljs.io
[@babel/standalone]: https://github.com/babel/babel/tree/master/packages/babel-standalone
[requirejs-babel7]: https://www.npmjs.com/package/requirejs-babel7
[babel-plugin-module-resolver-standalone]: https://www.npmjs.com/package/babel-plugin-module-resolver-standalone
