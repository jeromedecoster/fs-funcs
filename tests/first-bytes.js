const fn = require('../first-bytes')
const paths = require('./paths')


beforeAll(() => {
  paths.create()
})

afterAll(() => {
  paths.remove()
})


// https://github.com/feross/is-buffer/blob/master/index.js
function isBuffer(obj) {
  return obj != null && !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

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

test('the length is invalid', async () => {
  try {
    await fn(paths.fixtures.png, '12')
    expect('this must').toBe('be ignored')
  } catch(err) {
    expect(err.message).toBe('"length" argument must be a number ≥ 0')
  }

  try {
    await fn(paths.fixtures.png, NaN)
    expect('this must').toBe('be ignored')
  } catch(err) {
    expect(err.message).toBe('"length" argument must be a number ≥ 0')
  }

  try {
    await fn(paths.fixtures.png, -1)
    expect('this must').toBe('be ignored')
  } catch(err) {
    expect(err.message).toBe('"length" argument must be a number ≥ 0')
  }
})

test('the path target a file', async () => {
  var other = Buffer.from([97, 98, 99, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])

  var buf = await fn(paths.permissions.user.write + '/fixture')
  expect(isBuffer(buf)).toBe(true)
  expect(buf.length).toBe(other.length)
  expect(buf.equals(other)).toBe(true)
})

test('the path target a png', async () => {
  var other = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68])

  var buf = await fn(paths.fixtures.png)
  expect(isBuffer(buf)).toBe(true)
  expect(buf.length).toBe(other.length)
  expect(buf.equals(other)).toBe(true)
})

test('the path target a symlink who target a file', async () => {
  var other = Buffer.from([137, 80, 78, 71])

  var buf = await fn(paths.symlinks.png, 4)
  expect(isBuffer(buf)).toBe(true)
  expect(buf.length).toBe(other.length)
  expect(buf.equals(other)).toBe(true)
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
