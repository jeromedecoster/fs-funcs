const stat = require('./stat')

module.exports = (path) => {
  return new Promise((resolve, reject) => {
    stat(path)
    .then(result => {
      return result.file !== true
        ? reject(new TypeError('"path" argument must target a file'))
        : resolve(result.size)
    })
    .catch(reject)
  })
}
