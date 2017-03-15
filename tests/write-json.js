const read = require('fs-extra').readJsonSync
const fn = require('../write-json')
const paths = require('./paths')
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

test('the data must be defined', async () => {
  try {
    await fn('/a/b/c')
    expect('this must').toBe('be ignored')
  } catch(err) {
    expect(err.message).toBe('"data" argument is required')
  }
})

test('write a json file with a data object', async () => {
  var path = paths.tmp.directory + '/file/with/object'
  var result = await fn(path, {a:2, b:'c'})
  expect(result).toMatchObject({a:2, b:'c'})
  expect(read(path)).toMatchObject({a:2, b:'c'})
  expect(fs.readFileSync(path, 'utf-8')).toBe(`{
  "a": 2,
  "b": "c"
}`)
})

test('write a json file with a data string', async () => {
  var path = paths.tmp.directory + '/file/with/string'
  var result = await fn(path, 'abc')
  expect(result).toBe('abc')
  expect(read(path)).toBe('abc')
  expect(fs.readFileSync(path, 'utf-8')).toBe('"abc"')
})

test('write a json file with a data object and minify = true', async () => {
  var path = paths.tmp.directory + '/file/with/object'
  var result = await fn(path, {a:2, b:'c'}, true)
  expect(result).toMatchObject({a:2, b:'c'})
  expect(read(path)).toMatchObject({a:2, b:'c'})
  expect(fs.readFileSync(path, 'utf-8')).toBe('{"a":2,"b":"c"}')
})

test('write a json file with a data string and minify = true', async () => {
  var path = paths.tmp.directory + '/file/with/string'
  var result = await fn(path, 'abc', true)
  expect(result).toBe('abc')
  expect(read(path)).toBe('abc')
  expect(fs.readFileSync(path, 'utf-8')).toBe('"abc"')
})
