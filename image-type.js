const first = require('./first-bytes')
const fs = require('fs')

module.exports = (path) => {
  return new Promise((resolve, reject) => {
    first(path)
    .then(buf => {
      resolve(check(buf))
    })
    .catch(reject)
  })
}

function check(buf) {
  if (buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) return 'jpg'
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) return 'png'
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return 'gif'
  if (buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) return 'webp'
  if (buf[0] === 0x49 && buf[1] === 0x49 && buf[2] === 0xBC) return 'jxr'
  if (buf[0] === 0x42 && buf[1] === 0x4D) return 'bmp'
  if (buf[0] === 0x4D && buf[1] === 0x4D && buf[2] === 0x0 && buf[3] === 0x2A) return 'tif' // big endian
  if (buf[0] === 0x49 && buf[1] === 0x49 && buf[2] === 0x2A && buf[3] === 0x0) return 'tif' // little endian
  return null
}
