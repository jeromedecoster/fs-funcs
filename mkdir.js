const cp = require('child_process')
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

    cp.exec(`mkdir -m 755 -p "${p}"`, err1 => {
      if (err1) {
        var msg = err1.message.trim().toLowerCase()
        // https://nodejs.org/dist/latest-v7.x/docs/api/errors.html#errors_common_system_errors
        if (msg.endsWith('not a directory')) {
          return reject(error('"path" argument must be a directory', 'ENOTDIR', p))
        }
        if (msg.endsWith('permission denied')) {
          return reject(error('"path" argument is not accessible, permission denied', 'EACCES', p))
        }
        if (msg.endsWith('operation not permitted')) {
          return reject(error('"path" argument is inappropriate, operation not permitted', 'EPERM', p))
        }
        return reject(err1)
      }
      // one more check
      fs.stat(p, (err2, stats) => {
        if (err2) return reject(err2)
        if (stats.isDirectory() === false) {
          return reject(error('the directory creation has failed', 'ENOTDIR', p))
        }
        resolve(p)
      })
    })
  })
}

function error(msg, code, path) {
  var err = new Error(msg)
  err.code = code
  err.path = path
  return err
}
