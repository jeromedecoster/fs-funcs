const mkdirp = require('mkdirp')
const path = require('path')
const fs = require('fs')

module.exports = (p, pop) => {
  return new Promise((resolve, reject) => {
    if (typeof p !== 'string') {
      return reject(new TypeError('"path" argument must be a string'))
    }
    if (p.length === 0) {
      return reject(new TypeError('"path" argument must have a length > 0'))
    }

    try {
      p = path.resolve(p)
      if (pop === true) p = path.dirname(p)
    } catch (err) { return reject(err) }

    mkdirp(p, (err) => {
      if (err) return reject(err)
      resolve(p)
    })
  })
}
