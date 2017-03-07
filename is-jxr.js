const type = require('./image-type')

module.exports = (path) => {
  return type(path).then(result => result === 'jxr')
}
