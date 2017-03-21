const stat = require('./stat')

module.exports = (path, nofollow) => {
  return new Promise((resolve, reject) => {
    stat(path, nofollow)
    .then(result => {
      resolve(true)
    })
    .catch(err => {
      return err.code === 'ENOENT'
        ? resolve(false)
        : reject(err)
    })
  })
}
