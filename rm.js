const rimraf = require('rimraf')
const path = require('path')
const fs = require('fs')

module.exports = (p) => {
  return new Promise((resolve, reject) => {
    if (typeof p !== 'string') {
      return reject(new TypeError('"path" argument must be a string'))
    }
    if (p.length === 0) {
      return reject(new TypeError('"path" argument must have a length > 0'))
    }

    try {
      p = path.resolve(p)
    } catch (err) { return reject(err) }

    rimraf(p, { disableGlob: true }, (err) => {
      if (err) return reject(err)
      resolve(p)
    })
  })
}
