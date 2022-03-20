const { ok, strictEqual } = require('assert')
const exported = require('.')

ok(exported)
strictEqual(typeof exported, 'object')
strictEqual(typeof exported.findByAuthor, 'function')

exported
  .findByAuthor({ authors: ['terkel'] })
  .then(({ directories }) =>
    ok(directories.some(directory => directory.endsWith('node_modules/tiny-glob')))
  )
  .catch(error => {
    console.error(error)
    process.exitCode = 1
  })
