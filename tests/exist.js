const paths = require('./paths')
const fn = require('../exist')


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
  expect(await fn(paths.nothing)).toBe(false)
  expect(await fn(paths.nothing, true)).toBe(false)
})

test('the path target a directory', async () => {
  expect(await fn(__dirname)).toBe(true)
  expect(await fn(__dirname, true)).toBe(true)
})

test('the path target a file', async () => {
  expect(await fn(__filename)).toBe(true)
  expect(await fn(__filename, true)).toBe(true)
})

test('the path target a symlink who target a file', async () => {
  expect(await fn(paths.symlinks.png)).toBe(true)
  expect(await fn(paths.symlinks.png, true)).toBe(true)
})


test('the path target a symlink who target nothing', async () => {
  expect(await fn(paths.symlinks.nothing)).toBe(false)
  expect(await fn(paths.symlinks.nothing, true)).toBe(true)
})

test('the path target a symlink who target a directory', async () => {
  expect(await fn(paths.symlinks.directory)).toBe(true)
  expect(await fn(paths.symlinks.directory, true)).toBe(true)
})

test('the path target a directory with no user read permission', async () => {
  expect(await fn(paths.permissions.user.read)).toBe(true)
  expect(await fn(paths.permissions.user.read, true)).toBe(true)
})

test('the path target a directory with no user execute permission', async () => {
  expect(await fn(paths.permissions.user.execute)).toBe(true)
  expect(await fn(paths.permissions.user.execute, true)).toBe(true)
})

test('the path target a directory with no user write permission', async () => {
  expect(await fn(paths.permissions.user.write)).toBe(true)
  expect(await fn(paths.permissions.user.write, true)).toBe(true)
})

test('the path target a file within a directory with no user execute permission', async () => {
  try {
    await fn(paths.permissions.user.execute + '/fixture')
    expect('this must').toBe('be ignored')
  } catch(err) {
    // a directory without execute permission can't be browsed
    expect(err.message.includes('permission denied')).toBe(true)
  }
})

test('the path target a file within a directory with no user read permission', async () => {
  expect(await fn(paths.permissions.user.read + '/fixture')).toBe(true)
})

test('the path target a file within a directory with no user write permission', async () => {
  expect(await fn(paths.permissions.user.write + '/fixture')).toBe(true)
  expect(await fn(paths.permissions.user.write + '/fixture', true)).toBe(true)
})
