const file = require('./is-file')
const fs = require('fs')

module.exports = (path, nofollow) => {
  return new Promise((resolve, reject) => {
    if (typeof path !== 'string') {
      return reject(new TypeError('"path" argument must be a string'))
    }

    var fn = nofollow === true
      ? fs.lstat
      : fs.stat
      fn.call(null, path, (err, stats) => {
        if (err) return reject(err)

        resolve({
          file:      stats.isFile(),
          directory: stats.isDirectory(),
          symlink:   stats.isSymbolicLink(),
          // important: if it is a directory, the size does not reflect the size of all contained files
          size: stats.size,
          // https://github.com/TooTallNate/stat-mode/blob/master/index.js
          readable:   Boolean(stats.mode & 256),
          writable:   Boolean(stats.mode & 128),
          executable: Boolean(stats.mode & 64),
        })
      })
  })
}
