const path = require('path')
const fs = require('fs')

module.exports = (p) => {
  return new Promise((resolve, reject) => {
    if (typeof p !== 'string') {
      return reject(new TypeError('"path" argument must be a string'))
    }
    if (p.length === 0) {
      return reject(new TypeError('"path" argument must have a length > 0'))
    }

    try {
      p = path.resolve(p)
    } catch (err) { return reject(err) }

    rimraf(p, (err) => {
      if (err) return reject(err)
      resolve(p)
    })
  })
}

// adapted from https://github.com/jprichardson/node-fs-extra/blob/master/lib/remove/rimraf.js
// simplified version of rimraf (no options, no glob matching, no windows eperm debug, no retry)

// Two possible strategies.
// 1. Assume it's a file.  unlink it, then do the dir stuff on EPERM or EISDIR
// 2. Assume it's a directory.  readdir, then do the file stuff on ENOTDIR
//
// Both result in an extra syscall when you guess wrong.  However, there
// are likely far more normal files in the world than directories.  This
// is based on the assumption that a the average number of files per
// directory is >= 1.
//
// If anyone ever complains about this, then I guess the strategy could
// be made configurable somehow.  But until then, YAGNI.
function rimraf(p, cb) {
  // sunos lets the root user unlink directories, which is... weird.
  // so we have to lstat here and make sure it's not a dir.
  fs.lstat(p, (er, st) => {
    if (er && er.code === 'ENOENT') {
      return cb(null)
    }

    if (st && st.isDirectory()) {
      return rmdir(p, er, cb)
    }

    fs.unlink(p, er => {
      if (er) {
        if (er.code === 'ENOENT') {
          return cb(null)
        }
        if (er.code === 'EPERM') {
          rmdir(p, er, cb)
        }
        if (er.code === 'EISDIR') {
          return rmdir(p, er, cb)
        }
      }
      return cb(er)
    })
  })
}

function rmdir(p, originalEr, cb) {
  // try to rmdir first, and only readdir on ENOTEMPTY or EEXIST (SunOS)
  // if we guessed wrong, and it's not a directory, then
  // raise the original error.
  fs.rmdir(p, er => {
    if (er && (er.code === 'ENOTEMPTY' || er.code === 'EEXIST' || er.code === 'EPERM')) {
      rmkids(p,  cb)
    } else if (er && er.code === 'ENOTDIR') {
      cb(originalEr)
    } else {
      cb(er)
    }
  })
}

function rmkids(p, cb) {
  fs.readdir(p, (er, files) => {
    if (er) return cb(er)

    let n = files.length
    let errState

    if (n === 0) return fs.rmdir(p, cb)

    files.forEach(f => {
      rimraf(path.join(p, f), er => {
        if (errState) {
          return
        }
        if (er) return cb(errState = er)
        if (--n === 0) {
          fs.rmdir(p, cb)
        }
      })
    })
  })
}
