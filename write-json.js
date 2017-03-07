const mkdir = require('./mkdir')
const path = require('path')
const fs = require('fs')

module.exports = (p, data) => {
  return new Promise((resolve, reject) => {
    if (typeof p !== 'string') {
      return reject(new TypeError('"path" argument must be a string'))
    }
    if (data === undefined) {
      return reject(new TypeError('"data" argument is required'))
    }

    mkdir(p, true).then(() => {
      var str = JSON.stringify(data, null, 2)
      fs.writeFile(p, str, (err) => {
        if (err) return reject(`saveJSON error: ${err}`)
        resolve(data)
      })
    })
  })
}
