const fn = require('../exec-file')
const paths = require('./paths')
const path = require('path')


beforeAll(() => {
  paths.create()
})

afterAll(() => {
  paths.remove()
})


test('the file is not a string', async () => {
  try {
    await fn()
    expect('this must').toBe('be ignored')
  } catch(err) {
    expect(err.message).toBe('"file" argument must be a string')
  }

  try {
    await fn(12)
    expect('this must').toBe('be ignored')
  } catch(err) {
    expect(err.message).toBe('"file" argument must be a string')
  }
})

test('the file does not exists', async () => {
  try {
    await fn('123')
    expect('this must').toBe('be ignored')
  } catch(err) {
    expect(err.code).toBe('ENOENT')
    expect(err.message.includes('spawn')).toBe(true)
  }
})

test('the file target a directory', async () => {
  try {
    await fn(__dirname)
    expect('this must').toBe('be ignored')
  } catch(err) {
    expect(err.message.includes('spawn')).toBe(true)
  }
})

test('the file target a file', async () => {
  try {
    await fn(__filename)
    expect('this must').toBe('be ignored')
  } catch(err) {
    expect(err.message.includes('spawn')).toBe(true)
  }
})

test('the prog is run with bad arguments', async () => {
  fn(paths.prog, 12, 34)
  .then(result => {
    expect(typeof result.stdout).toBe('string')
    expect(result.stdout.includes('cwd:')).toBe(true)
    var last = result.stdout.charCodeAt(result.stdout.length - 1)
    expect(last !== 10 && last !== 13).toBe(true)

    expect(typeof result.stderr).toBe('string')
    expect(result.stderr.includes('usage:')).toBe(true)
    var last = result.stderr.charCodeAt(result.stderr.length - 1)
    expect(last !== 10 && last !== 13).toBe(true)
  })
  .catch(err => {
    expect('this must').toBe('be ignored')
  })
})

test('the prog is run with no argument', async () => {
  fn(paths.prog)
  .then(result => {
    expect(typeof result.stdout).toBe('string')
    expect(result.stdout.includes('cwd:')).toBe(true)
    var last = result.stdout.charCodeAt(result.stdout.length - 1)
    expect(last !== 10 && last !== 13).toBe(true)

    expect(typeof result.stderr).toBe('string')
    expect(result.stderr.includes('usage:')).toBe(true)
    var last = result.stderr.charCodeAt(result.stderr.length - 1)
    expect(last !== 10 && last !== 13).toBe(true)
  })
  .catch(err => {
    expect('this must').toBe('be ignored')
  })
})

test('the prog is run with args', async () => {
  fn(paths.prog, 'abc def')
  .then(result => {
    expect(result.stdout).toBe('abc\ndef')
    expect(result.stderr).toBe('')
  })
  .catch(err => {
    expect('this must').toBe('be ignored')
  })

  fn(paths.prog, ' abc   def  ')
  .then(result => {
    expect(result.stdout).toBe('abc\ndef')
    expect(result.stderr).toBe('')
  })
  .catch(err => {
    expect('this must').toBe('be ignored')
  })

  fn(paths.prog, ['abc', 'def'])
  .then(result => {
    expect(result.stdout).toBe('abc\ndef')
    expect(result.stderr).toBe('')
  })
  .catch(err => {
    expect('this must').toBe('be ignored')
  })
})

test('the prog returns stderr without crash', async () => {
  fn(paths.prog, '--stderr abc')
  .then(result => {
    expect(result.stdout).toBe('abc')
    expect(result.stderr.includes('stderr message:')).toBe(true)
  })
  .catch(err => {
    expect('this must').toBe('be ignored')
  })
})

test('the prog returns exit with code 128', async () => {
  fn(paths.prog, 'abc --exit def')
  .then(result => {
    expect('this must').toBe('be ignored')
  })
  .catch(err => {
    expect(err.message.includes('exit is coming')).toBe(true)
    expect(err.code).toBe(128)
  })
})

test('the prog returns the correct cwd', async () => {
  fn(paths.prog, '--cwd')
  .then(result => {
    expect(result.stdout).toBe(process.cwd())
    expect(result.stderr).toBe('')
  })
  .catch(err => {
    expect('this must').toBe('be ignored')
  })

  var parent = path.dirname(process.cwd())
  fn(paths.prog, '--cwd', {cwd:parent})
  .then(result => {
    expect(result.stdout).toBe(parent)
    expect(result.stderr).toBe('')
  })
  .catch(err => {
    expect('this must').toBe('be ignored')
  })
})

test('the prog returns the correct lines', async () => {
  fn(paths.prog, '--rand')
  .then(result => {
    expect(result.stdout.split('\n').every(e => e.startsWith('loop'))).toBe(true)
  })
  .catch(err => {
    expect('this must').toBe('be ignored')
  })
})

test('the prog must not thow a stdout maxBuffer exceeded error', async () => {
  fn(paths.prog, '--lot')
  .then(result => {
    expect(result.stdout.split('\n').every(e => e.startsWith('loop'))).toBe(true)
    expect(result.stdout.startsWith('loop 1 / 100000')).toBe(true)
  })
  .catch(err => {
    expect('this must').toBe('be ignored')
  })

  // with the default maxBuffer it must throw an error
  fn(paths.prog, '--lot', { maxBuffer: 200 * 1024 })
  .then(result => {
    expect('this must').toBe('be ignored')
  })
  .catch(err => {
    expect(err.message.includes('stdout maxBuffer exceeded')).toBe(true)
    expect(err.stdout.startsWith('loop 1 / 100000')).toBe(true)
    expect(err.stderr).toBe('')
  })
})

test('the prog must thow a stdout maxBuffer exceeded error', async () => {
  fn(paths.prog, '--toomuch')
  .then(result => {
    expect('this must').toBe('be ignored')
  })
  .catch(err => {
    expect(err.message.includes('stdout maxBuffer exceeded')).toBe(true)
    expect(err.stdout.startsWith('loop 1 / 2000000')).toBe(true)
    expect(err.stderr).toBe('')
  })
})
