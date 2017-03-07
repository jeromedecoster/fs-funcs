const stat = require('./stat')
const fs = require('fs')

module.exports = (path, nothrow) => {
  return new Promise((resolve, reject) => {
    stat(path)
    .then(result => {
      if (nothrow === true || result.directory === true) {
        return resolve(result.directory === true)
      }
      reject(new TypeError('"path" argument must target a directory'))
    })
    .catch(err => {
      if (nothrow === true && err.code === 'ENOENT') {
        return resolve(false)
      }
      reject(err)
    })
  })
}
