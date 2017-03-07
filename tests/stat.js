const paths = require('./paths')
const fn = require('../stat')


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
    // throw an ENOENT error
    expect(err.message.includes('no such file or directory')).toBe(true)
  }
})

test('the path target a directory', async () => {
  expect(await fn(__dirname)).toMatchObject({
    file: false,
    directory: true,
    symlink: false,
    // size: -1,
    readable: true,
    writable: true,
    executable: true
  })

  expect(await fn(__dirname, true)).toMatchObject({
    file: false,
    directory: true,
    symlink: false,
    // size: -1,
    readable: true,
    writable: true,
    executable: true
  })
})

test('the path target a file', async () => {
  expect(await fn(paths.fixtures.png)).toMatchObject({
    file: true,
    directory: false,
    symlink: false,
    size: 54318,
    readable: true,
    writable: true,
    executable: false
  })

  expect(await fn(paths.fixtures.png, true)).toMatchObject({
    file: true,
    directory: false,
    symlink: false,
    size: 54318,
    readable: true,
    writable: true,
    executable: false
  })
})

test('the path target a symlink who target a file', async () => {
  expect(await fn(paths.symlinks.png)).toMatchObject({
    file: true,
    directory: false,
    symlink: false,
    size: 54318,
    readable: true,
    writable: true,
    executable: false
  })

  expect(await fn(paths.symlinks.png, true)).toMatchObject({
    file: false,
    directory: false,
    symlink: true,
    size: 14,
    readable: true,
    writable: true,
    executable: true
  })
})

test('the path target a symlink who target nothing', async () => {
  try {
    await fn(paths.symlinks.nothing)
    expect('this must').toBe('be ignored')
  } catch(err) {
    // throw an ENOENT error
    expect(err.message.includes('no such file or directory')).toBe(true)
  }

  expect(await fn(paths.symlinks.nothing, true)).toMatchObject({
    file: false,
    directory: false,
    symlink: true,
    size: 9,
    readable: true,
    writable: true,
    executable: true
  })
})

test('the path target a symlink who target a directory', async () => {
  expect(await fn(paths.symlinks.directory)).toMatchObject({
    file: false,
    directory: true,
    symlink: false,
    // size: -1,
    readable: true,
    writable: true,
    executable: true
  })

  expect(await fn(paths.symlinks.directory, true)).toMatchObject({
    file: false,
    directory: false,
    symlink: true,
    size: 2,
    readable: true,
    writable: true,
    executable: true
  })
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
  expect(await fn(paths.permissions.user.read + '/fixture')).toMatchObject({
    file: true,
    directory: false,
    symlink: false,
    size: 3,
    readable: true,
    writable: true,
    executable: false
  })
})

test('the path target a file within a directory with no user write permission', async () => {
  expect(await fn(paths.permissions.user.write + '/fixture')).toMatchObject({
    file: true,
    directory: false,
    symlink: false,
    size: 3,
    readable: true,
    writable: true,
    executable: false
  })
})
