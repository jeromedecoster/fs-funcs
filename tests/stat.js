const paths = require('./paths')
const fn = require('../stat')
const path = require('path')
const fs = require('fs')


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
  var obj = path.parse(__dirname)
  expect(await fn(__dirname)).toMatchObject({
    file: false,
    directory: true,
    symlink: false,
    path: path.join(obj.dir, obj.base),
    dirname: obj.dir,
    basename: obj.base,
    // size: -1,
    readable: true,
    writable: true,
    executable: true
  })

  expect(await fn(__dirname, true)).toMatchObject({
    file: false,
    directory: true,
    symlink: false,
    path: path.join(obj.dir, obj.base),
    dirname: obj.dir,
    basename: obj.base,
    // size: -1,
    readable: true,
    writable: true,
    executable: true
  })
})

test('the path target a file', async () => {
  var obj = path.parse(paths.fixtures.png)
  expect(await fn(paths.fixtures.png)).toMatchObject({
    file: true,
    directory: false,
    symlink: false,
    path: path.join(obj.dir, obj.base),
    dirname: obj.dir,
    basename: obj.base,
    size: 54318,
    readable: true,
    writable: true,
    executable: false
  })

  expect(await fn(paths.fixtures.png, true)).toMatchObject({
    file: true,
    directory: false,
    symlink: false,
    path: path.join(obj.dir, obj.base),
    dirname: obj.dir,
    basename: obj.base,
    size: 54318,
    readable: true,
    writable: true,
    executable: false
  })
})


test('the path target a symlink who target a file', async () => {
  var obj1 = path.parse(path.resolve(paths.symlinks.png, fs.readlinkSync(paths.symlinks.png)))
  expect(await fn(paths.symlinks.png)).toMatchObject({
    file: true,
    directory: false,
    symlink: false,
    path: path.join(obj1.dir, obj1.base),
    dirname: obj1.dir,
    basename: obj1.base,
    size: 54318,
    readable: true,
    writable: true,
    executable: false
  })

  var obj2 = path.parse(paths.symlinks.png)
  expect(await fn(paths.symlinks.png, true)).toMatchObject({
    file: false,
    directory: false,
    symlink: true,
    path: path.join(obj2.dir, obj2.base),
    dirname: obj2.dir,
    basename: obj2.base,
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

  var obj = path.parse(paths.symlinks.nothing)
  expect(await fn(paths.symlinks.nothing, true)).toMatchObject({
    file: false,
    directory: false,
    symlink: true,
    path: path.join(obj.dir, obj.base),
    dirname: obj.dir,
    basename: obj.base,
    size: 9,
    readable: true,
    writable: true,
    executable: true
  })
})


test('the path target a symlink who target a directory', async () => {
  var obj1 = path.parse(path.resolve(paths.symlinks.directory, fs.readlinkSync(paths.symlinks.directory)))
  expect(await fn(paths.symlinks.directory)).toMatchObject({
    file: false,
    directory: true,
    symlink: false,
    path: path.join(obj1.dir, obj1.base),
    dirname: obj1.dir,
    basename: obj1.base,
    // size: -1,
    readable: true,
    writable: true,
    executable: true
  })

  var obj2 = path.parse(paths.symlinks.directory)
  expect(await fn(paths.symlinks.directory, true)).toMatchObject({
    file: false,
    directory: false,
    symlink: true,
    path: path.join(obj2.dir, obj2.base),
    dirname: obj2.dir,
    basename: obj2.base,
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
  var obj = path.parse(paths.permissions.user.read + '/fixture')
  expect(await fn(paths.permissions.user.read + '/fixture')).toMatchObject({
    file: true,
    directory: false,
    symlink: false,
    path: path.join(obj.dir, obj.base),
    dirname: obj.dir,
    basename: obj.base,
    size: 3,
    readable: true,
    writable: true,
    executable: false
  })
})

test('the path target a file within a directory with no user write permission', async () => {
  var obj = path.parse(paths.permissions.user.write + '/fixture')
  expect(await fn(paths.permissions.user.write + '/fixture')).toMatchObject({
    file: true,
    directory: false,
    symlink: false,
    path: path.join(obj.dir, obj.base),
    dirname: obj.dir,
    basename: obj.base,
    size: 3,
    readable: true,
    writable: true,
    executable: false
  })
})

test('the path target the root', async () => {
  var obj = path.parse('/')
  expect(await fn('/')).toMatchObject({
    file: false,
    directory: true,
    symlink: false,
    path: path.join(obj.dir, obj.base), // '/'
    dirname: obj.dir,                   // '/'
    basename: obj.base,                 // ''
    readable: true,
    writable: true,
    executable: true
  })
})
