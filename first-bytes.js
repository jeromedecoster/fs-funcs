const file = require('./is-file')
const fs = require('fs')

module.exports = (path, length) => {
  return new Promise((resolve, reject) => {
    if (length === undefined) {
      length = 15
    }
    if (typeof length !== 'number' || length !== length || length < 0) {
      return reject(new TypeError('"length" argument must be a number ≥ 0'))
    }

    file(path)
    .then(result => {
      // https://github.com/sindresorhus/read-chunk/blob/master/index.js
      let buf = Buffer.alloc(length)
      fs.open(path, 'r', (err, fd) => {
        if (err) return reject(err)
        fs.read(fd, buf, 0, length, 0, (err) => {
          if (err) return reject(err)
          fs.close(fd, (err) => {
            if (err) return reject(err)

            resolve(buf)
          })
        })
      })
    })
    .catch(reject)
  })
}
