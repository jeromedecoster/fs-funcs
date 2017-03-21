const rimraf = require('rimraf')
const _path_ = require('path')

module.exports = (path) => {
  return new Promise((resolve, reject) => {
    if (typeof path !== 'string') {
      return reject(new TypeError('"path" argument must be a string'))
    }
    if (path.length === 0) {
      return reject(new TypeError('"path" argument must have a length > 0'))
    }

    try {
      path = _path_.resolve(path)
    } catch (err) { return reject(err) }

    rimraf(path, { disableGlob: true }, (err) => {
      return err !== null
        ? reject(err)
        : resolve(path)
    })
  })
}
