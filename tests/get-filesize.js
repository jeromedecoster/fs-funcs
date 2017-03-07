const fn = require('../get-filesize')
const paths = require('./paths')


beforeAll(() => {
  paths.create()
})

afterAll(() => {
  paths.remove()
})


test('the path is not a string', async () => {
  try {
    await fn()
    expect('this must').toBe('be ignored')
  } catch(err) {
    expect(err.message).toBe('"path" argument must be a string')
  }

  try {
    await fn(12)
    expect('this must').toBe('be ignored')
  } catch(err) {
    expect(err.message).toBe('"path" argument must be a string')
  }
})

test('the path does not exists', async () => {
  try {
    await fn(paths.nothing)
    expect('this must').toBe('be ignored')
  } catch(err) {
    expect(err.message.includes('no such file or directory')).toBe(true)
  }
})

test('the path target a directory', async () => {
  try {
    await fn(__dirname)
    expect('this must').toBe('be ignored')
  } catch(err) {
    expect(err.message).toBe('"path" argument must target a file')
  }
})

test('the path target a file', async () => {
  expect(await fn(paths.fixtures.png)).toBe(54318)
})

test('the path target a symlink who target a file', async () => {
  expect(await fn(paths.symlinks.png)).toBe(54318)
})

test('the path target a symlink who target nothing', async () => {
  try {
    await fn(paths.symlinks.nothing)
    expect('this must').toBe('be ignored')
  } catch(err) {
    expect(err.message.includes('no such file or directory')).toBe(true)
  }
})

test('the path target a symlink who target a directory', async () => {
  try {
    await fn(paths.symlinks.directory)
    expect('this must').toBe('be ignored')
  } catch(err) {
    expect(err.message).toBe('"path" argument must target a file')
  }
})
