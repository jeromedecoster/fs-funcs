const stat = require('./stat')

module.exports = (path, nothrow) => {
  return new Promise((resolve, reject) => {
    stat(path)
    .then(result => {
      return nothrow === true || result.directory === true
        ? resolve(result.directory === true)
        : reject(new TypeError('"path" argument must target a directory'))
    })
    .catch(err => {
      return nothrow === true && err.code === 'ENOENT'
        ? resolve(false)
        : reject(err)
    })
  })
}
