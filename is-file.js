const stat = require('./stat')

module.exports = (path, nothrow) => {
  return new Promise((resolve, reject) => {
    stat(path)
    .then(result => {
      return nothrow === true || result.file === true
        ? resolve(result.file === true)
        : reject(new TypeError('"path" argument must target a file'))
    })
    .catch(err => {
      return nothrow === true && err.code === 'ENOENT'
        ? resolve(false)
        : reject(err)
    })
  })
}
