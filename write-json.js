const mkdir = require('./mkdir')
const fs = require('fs')

module.exports = (path, data, minify) => {
  return new Promise((resolve, reject) => {
    if (typeof path !== 'string') {
      return reject(new TypeError('"path" argument must be a string'))
    }
    if (data === undefined) {
      return reject(new TypeError('"data" argument is required'))
    }

    mkdir(path, true).then(() => {
      var str = minify === true
        ? JSON.stringify(data)
        : JSON.stringify(data, null, 2)

      fs.writeFile(path, str, (err) => {
        return err !== null
          ? reject(`saveJSON error: ${err}`)
          : resolve(data)
      })
    })
  })
}
