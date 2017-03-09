const paths = require('./paths')
const fn = require('../is-webp')


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

test('the path target a file which is not an image', async () => {
  expect(await fn(__filename)).toBe(false)
})

test('the path target a bmp', async () => {
  expect(await fn(paths.fixtures.bmp)).toBe(false)
})

test('the path target a gif', async () => {
  expect(await fn(paths.fixtures.gif)).toBe(false)
})

test('the path target a jpg', async () => {
  expect(await fn(paths.fixtures.jpg)).toBe(false)
})

test('the path target a jxr', async () => {
  expect(await fn(paths.fixtures.jxr)).toBe(false)
})

test('the path target a png', async () => {
  expect(await fn(paths.fixtures.png)).toBe(false)
})

test('the path target a big endian tif', async () => {
  expect(await fn(paths.fixtures.tif.be)).toBe(false)
})

test('the path target a little endian tif', async () => {
  expect(await fn(paths.fixtures.tif.le)).toBe(false)
})

test('the path target a webp', async () => {
  expect(await fn(paths.fixtures.webp)).toBe(true)
})

test('the path target a symlink who target a png', async () => {
  expect(await fn(paths.symlinks.png)).toBe(false)
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
  expect(await fn(paths.permissions.user.read + '/fixture')).toBe(false)
})

test('the path target a file within a directory with no user write permission', async () => {
  expect(await fn(paths.permissions.user.write + '/fixture')).toBe(false)
})
