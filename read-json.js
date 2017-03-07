const file = require('./is-file')
const fs = require('fs')

module.exports = (path) => {
  return new Promise((resolve, reject) => {
    file(path)
    .then(() => {
      fs.readFile(path, 'utf8', (err, data) => {
        if (err) return reject(err)
        try {
          data = JSON.parse(data)
          resolve(data)
        } catch(err) {
          reject(err)
        }
      })
    })
    .catch(err => {
      reject(err)
    })
  })
}
