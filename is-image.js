const type = require('./image-type')

module.exports = (path) => {
  return type(path).then(result => {
    return result === 'jpg'
      || result === 'png'
      || result === 'gif'
      || result === 'webp'
      || result === 'jxr'
      || result === 'bmp'
      || result === 'tif'
  })
}
