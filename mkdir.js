const mkdirp = require('mkdirp')
const _path_ = require('path')

module.exports = (path, pop) => {
  return new Promise((resolve, reject) => {
    if (typeof path !== 'string') {
      return reject(new TypeError('"path" argument must be a string'))
    }
    if (path.length === 0) {
      return reject(new TypeError('"path" argument must have a length > 0'))
    }

    try {
      path = _path_.resolve(path)
      if (pop === true) path = _path_.dirname(path)
    } catch (err) { return reject(err) }

    mkdirp(path, (err) => {
      return err !== null
        ? reject(err)
        : resolve(path)
    })
  })
}
