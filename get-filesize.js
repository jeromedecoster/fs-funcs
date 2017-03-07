const stat = require('./stat')
const fs = require('fs')

module.exports = (path) => {
  return new Promise((resolve, reject) => {
    stat(path)
    .then(result => {
      if (result.file !== true) {
        return reject(new TypeError('"path" argument must target a file'))
      }
      resolve(result.size)
    })
    .catch(reject)
  })
}
