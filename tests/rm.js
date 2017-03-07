const isdirectory = require('is-directory').sync
const resolve = require('path').resolve
const isfile = require('is-file').sync
const paths = require('./paths')
const fs = require('fs-extra')
const fn = require('../rm')


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
    expect(err instanceof TypeError).toBe(true)
    expect(err.message).toBe('"path" argument must be a string')
    expect(err.path).toBeUndefined()
    expect(err.code).toBeUndefined()
  }

  try {
    await fn(12)
    expect('this must').toBe('be ignored')
  } catch(err) {
    expect(err instanceof TypeError).toBe(true)
    expect(err.message).toBe('"path" argument must be a string')
    expect(err.path).toBeUndefined()
    expect(err.code).toBeUndefined()
  }
})

test('the path target a directory', async () => {
  var path = paths.tmp.directory + '/a'
  fs.ensureDirSync(path + '/b/c/d')
  expect(await fn(path)).toBe(path)
  expect(isdirectory(paths.tmp.directory)).toBe(true)
  expect(isdirectory(path)).toBe(false)
})

test('the path target a file', async () => {
  var path = paths.tmp.directory + '/g/h.json'
  fs.writeJson(path, {a: 1})
  expect(await fn(path)).toBe(path)
  expect(isdirectory(paths.tmp.directory)).toBe(true)
  expect(isdirectory(path)).toBe(false)
  expect(isfile(path)).toBe(false)
})

test('the path target a directory not accessible', async () => {
  try {
    await fn(paths.permissions.user.execute + '/a')
    expect('this must').toBe('be ignored')
  } catch(err) {
    expect(err instanceof TypeError).toBe(false)
    expect(err instanceof Error).toBe(true)
    expect(err.message).toBe('"path" argument is not accessible, permission denied')
    expect(err.code).toBe('EACCES')
    expect(err.path).toBe(paths.permissions.user.execute + '/a')
  }
})

test('the path target a directory with action not permitted', async () => {
  try {
    await fn('/tmp')
    expect('this must').toBe('be ignored')
  } catch(err) {
    expect(err instanceof TypeError).toBe(false)
    expect(err instanceof Error).toBe(true)
    expect(err.message).toBe('"path" argument is inappropriate, operation not permitted')
    expect(err.code).toBe('EPERM')
    expect(err.path).toBe('/tmp')
  }
})

test('the path has an invalid length', async () => {
  try {
    await fn('')
    expect('this must').toBe('be ignored')
  } catch(err) {
    expect(err instanceof TypeError).toBe(true)
    expect(err.message).toBe('"path" argument must have a length > 0')
    expect(err.path).toBeUndefined()
    expect(err.code).toBeUndefined()
  }
})

test('the path has strange chars', async () => {
  var path = paths.tmp.directory + '/with/////strange/////chars'
  var expected = paths.tmp.directory + '/with/strange/chars'
  fs.outputJsonSync(resolve(path), {a: 1})
  expect(isfile(expected)).toBe(true)
  expect(isdirectory(paths.tmp.directory + '/with/strange/')).toBe(true)
  var result = await fn(path)
  expect(result).toBe(expected)
  expect(isfile(expected)).toBe(false)
  expect(isdirectory(paths.tmp.directory + '/with/strange/')).toBe(true)
})
