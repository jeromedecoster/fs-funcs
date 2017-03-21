const stat = require('./stat')

module.exports = (path, nothrow) => {
  return new Promise((resolve, reject) => {
    stat(path, true)
    .then(result => {
      return nothrow === true || result.symlink === true
        ? resolve(result.symlink === true)
        : reject(new TypeError('"path" argument must target a symlink'))
    })
    .catch(err => {
      return nothrow === true && err.code === 'ENOENT'
        ? resolve(false)
        : reject(err)
    })
  })
}
