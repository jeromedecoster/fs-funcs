const stat = require('./stat')
const fs = require('fs')

module.exports = (path, nothrow) => {
  return new Promise((resolve, reject) => {
    stat(path, true)
    .then(result => {
      if (nothrow === true || result.symlink === true) {
        return resolve(result.symlink === true)
      }
      reject(new TypeError('"path" argument must target a symlink'))
    })
    .catch(err => {
      if (nothrow === true && err.code === 'ENOENT') {
        return resolve(false)
      }
      reject(err)
    })
  })
}
