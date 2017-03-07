const fn = require('../is-directory')
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

  expect(await fn(paths.nothing, true)).toBe(false)
})

test('the path target a directory', async () => {
  expect(await fn(__dirname)).toBe(true)
  expect(await fn(__dirname, true)).toBe(true)
})

test('the path target a file', async () => {
  try {
    await fn(await fn(__filename))
    expect('this must').toBe('be ignored')
  } catch(err) {
    expect(err.message).toBe('"path" argument must target a directory')
  }

  expect(await fn(__filename, true)).toBe(false)
})

test('the path target a symlink who target a file', async () => {
  try {
    await fn(await fn(paths.symlinks.png))
    expect('this must').toBe('be ignored')
  } catch(err) {
    expect(err.message).toBe('"path" argument must target a directory')
  }

  expect(await fn(paths.symlinks.png, true)).toBe(false)
})

test('the path target a symlink who target nothing', async () => {
  try {
    await fn(paths.symlinks.nothing)
    expect('this must').toBe('be ignored')
  } catch(err) {
    expect(err.message.includes('no such file or directory')).toBe(true)
  }

  expect(await fn(paths.symlinks.nothing, true)).toBe(false)
})

test('the path target a symlink who target a directory', async () => {
  expect(await fn(paths.symlinks.directory)).toBe(true)
})

test('the path target a file within a directory with no user execute permission', async () => {
  try {
    await fn(paths.permissions.user.execute + '/fixture')
    expect('this must').toBe('be ignored')
  } catch(err) {
    // a directory without execute permission can't be browsed
    expect(err.message.includes('permission denied')).toBe(true)
  }

  try {
    await fn(paths.permissions.user.execute + '/fixture', true)
    expect('this must').toBe('be ignored')
  } catch(err) {
    // a directory without execute permission can't be browsed
    expect(err.message.includes('permission denied')).toBe(true)
  }
})

test('the path target a file within a directory with no user read permission', async () => {
  try {
    await fn(await fn(paths.permissions.user.read + '/fixture'))
    expect('this must').toBe('be ignored')
  } catch(err) {
    expect(err.message).toBe('"path" argument must target a directory')
  }

  expect(await fn(paths.permissions.user.read + '/fixture', true)).toBe(false)
})

test('the path target a file within a directory with no user write permission', async () => {
  try {
    await fn(await fn(paths.permissions.user.write + '/fixture'))
    expect('this must').toBe('be ignored')
  } catch(err) {
    expect(err.message).toBe('"path" argument must target a directory')
  }

  expect(await fn(paths.permissions.user.write + '/fixture', true)).toBe(false)
})
