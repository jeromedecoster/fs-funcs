const isdirectory = require('is-directory').sync
const paths = require('./paths')
const fn = require('../mkdir')
const fs = require('fs-extra')


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

test('the path target is within an existing directory', async () => {
  var path = paths.tmp.directory + '/a'
  expect(await fn(path)).toBe(path)
  expect(await fn(path, true)).toBe(paths.tmp.directory)
  expect(isdirectory(path)).toBe(true)
})

test('the path target a file', async () => {
  try {
    await fn(paths.permissions.user.write + '/fixture/a')
    expect('this must').toBe('be ignored')
  } catch(err) {
    expect(err.message.includes('not a directory')).toBe(true)
    expect(err.code).toBe('ENOTDIR')
    expect(err.path).toBe(paths.permissions.user.write + '/fixture/a')
  }
})

test('the path target a directory not accessible', async () => {
  try {
    await fn(paths.permissions.user.execute + '/a')
    expect('this must').toBe('be ignored')
  } catch(err) {
    expect(err.message.includes('permission denied')).toBe(true)
    expect(err.code).toBe('EACCES')
    expect(err.path).toBe(paths.permissions.user.execute + '/a')
  }
})

test('the path target an already existing directory', async () => {
  var path = '/tmp'
  expect(await fn(path)).toBe(path)
  expect(await fn(path, true)).toBe('/')
  expect(isdirectory(path)).toBe(true)
})

test('create a directory with pop', async () => {
  var path = paths.tmp.directory + '/with pop'
  var result = await fn(path + '/test', true)
  expect(result).toBe(path)
  expect(isdirectory(path)).toBe(true)
})

test('create a directory without pop', async () => {
  var path = paths.tmp.directory + '/without pop/test'
  var result = await fn(path)
  expect(result).toBe(path)
  expect(isdirectory(path)).toBe(true)
})

test('create a directory with strange chars', async () => {
  var path = paths.tmp.directory + '/with/////strange/////chars'
  var expected = paths.tmp.directory + '/with/strange/chars'
  var result = await fn(path)
  expect(result).toBe(expected)
  expect(isdirectory(expected)).toBe(true)
})

test('create a directory with invalid length', async () => {
  try {
    await fn('')
    expect('this must').toBe('be ignored')
  } catch(err) {
    expect(err.message).toBe('"path" argument must have a length > 0')
  }
})

test('create a long directory', async () => {
  var path = paths.tmp.directory + '/ab/cd/ef/gh/ij/kl'
  var result = await fn(path)
  expect(result).toBe(path)
  expect(isdirectory(path)).toBe(true)
})
