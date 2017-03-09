const path = require('path')
const fs = require('fs')

module.exports = (p, pop) => {
  return new Promise((resolve, reject) => {
    if (typeof p !== 'string') {
      return reject(new TypeError('"path" argument must be a string'))
    }
    if (p.length === 0) {
      return reject(new TypeError('"path" argument must have a length > 0'))
    }

    try {
      p = path.resolve(p)
      if (pop === true) p = path.dirname(p)
    } catch (err) { return reject(err) }

    mkdirs(p, (err) => {
      if (err) return reject(err)
      resolve(p)
    })
  })
}

// adapted from https://github.com/jprichardson/node-fs-extra/blob/master/lib/mkdirs/mkdirs.js
function mkdirs(p, cb, made) {
  // 493 means chmod 755
  fs.mkdir(p, 493, err1 => {
    if (!err1) {
      made = made || p
      return cb(null, made)
    }
    switch (err1.code) {
      case 'ENOENT':
        if (path.dirname(p) === p) return cb(err1)
        mkdirs(path.dirname(p), (err2, made) => {
          if (err2) cb(err2, made)
          else mkdirs(p, cb, made)
        })
        break

      // In the case of any other error, just see if there's a dir
      // there already.  If so, then hooray!  If not, then something
      // is borked.
      default:
        fs.stat(p, (err3, stats) => {
          // if the stat fails, then that's super weird.
          // let the original error be the failure reason.
          if (err3 || !stats.isDirectory()) cb(err1, made)
          else cb(null, made)
        })
        break
    }
  })
}
