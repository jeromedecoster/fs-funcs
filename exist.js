const stat = require('./stat')
const fs = require('fs')

module.exports = (path, nofollow) => {
  return new Promise((resolve, reject) => {
    stat(path, nofollow)
    .then(result => {
      resolve(true)
    })
    .catch(err => {
      if (err.code === 'ENOENT') return resolve(false)
      reject(err)
    })
  })
}
