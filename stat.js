const file = require('./is-file')
const path = require('path')
const fs = require('fs')

module.exports = (p, nofollow) => {
  return new Promise((resolve, reject) => {
    if (typeof p !== 'string') {
      return reject(new TypeError('"path" argument must be a string'))
    }

    lstat(p)
    .then(lstats => {
      return Promise.all([
        nofollow === true ? lstats : stat(p),
        lstats.isSymbolicLink()
      ])
    })
    .then(([stats, symlink]) => {
      return Promise.all([
        stats,
        parse(p, symlink === true && nofollow !== true)
      ])
    })
    .then(([stats, obj]) => {
      resolve({
        file:      stats.isFile(),
        directory: stats.isDirectory(),
        symlink:   stats.isSymbolicLink(),
        // `obj` is the parsed path object
        path:     path.join(obj.dir, obj.base),
        dirname:  obj.dir,
        basename: obj.base,
        // important: if it is a directory, the size does not reflect the size of all contained files
        size: stats.size,
        // https://github.com/TooTallNate/stat-mode/blob/master/index.js
        readable:   Boolean(stats.mode & 256),
        writable:   Boolean(stats.mode & 128),
        executable: Boolean(stats.mode & 64),
      })
    })
    .catch(reject)
  })
}

function lstat(p) {
  return new Promise((resolve, reject) => {
    fs.lstat(p, (err, stats) => {
      if (err) return reject(err)
      resolve(stats)
    })
  })
}

function stat(p) {
  return new Promise((resolve, reject) => {
    fs.stat(p, (err, stats) => {
      if (err) return reject(err)
      resolve(stats)
    })
  })
}

// `path.parse` with or without `follow` symlink ?
function parse(p, follow) {
  return new Promise((resolve, reject) => {
    if (follow === true) {
      fs.readlink(p, (err, target) => {
        if (err) return reject(err)
        resolve(path.parse(path.resolve(p, target)))
      })
    } else {
      resolve(path.parse(p))
    }
  })
}
