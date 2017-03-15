const fs = require('fs-extra')
const path = require('path')


function fixtures(subpath) {
  if (subpath == null) subpath = ''
  return path.resolve(`${__dirname}/../fixtures`, subpath)
}

const NOTHING = fixtures('nothing')
const FIXTURE_BMP = fixtures('fixture.bmp')
const FIXTURE_GIF = fixtures('fixture.gif')
const FIXTURE_JXR = fixtures('fixture.jxr')
const FIXTURE_JPG = fixtures('fixture.jpg')
const FIXTURE_PNG = fixtures('fixture.png')
const FIXTURE_WEBP = fixtures('fixture.webp')
const FIXTURE_JSON = fixtures('fixture.json')
const INVALIDS_JSON = fixtures('invalids/invalid.json')
const SYMLINKS_PNG = fixtures('symlinks/symlink-to-png')
const SYMLINKS_NOTHING = fixtures('symlinks/symlink-to-nothing')
const SYMLINKS_DIRECTORY = fixtures('symlinks/symlink-to-directory')
const USER_EXECUTE = '/tmp/permissions/no-user-execute'
const USER_READ = '/tmp/permissions/no-user-read'
const USER_WRITE = '/tmp/permissions/no-user-write'
const TMP_DIRECTORY = '/tmp/directory'
const PROG = fixtures('prog.sh')

function create () {
  fs.ensureDirSync(USER_EXECUTE)
  fs.ensureDirSync(USER_READ)
  fs.ensureDirSync(USER_WRITE)
  fs.outputFileSync(USER_EXECUTE + '/fixture', 'abc')
  fs.outputFileSync(USER_READ    + '/fixture', 'abc')
  fs.outputFileSync(USER_WRITE   + '/fixture', 'abc')
  fs.chmodSync(USER_EXECUTE, 0o677)
  fs.chmodSync(USER_READ,    0o377)
  fs.chmodSync(USER_WRITE,   0o577)
  fs.ensureDirSync(TMP_DIRECTORY)
}

function remove () {
  // fs.mkdirSync('/tmp/permissions')
  fs.chmodSync(USER_EXECUTE, 0o777)
  fs.chmodSync(USER_READ,    0o777)
  fs.chmodSync(USER_WRITE,   0o777)
  fs.removeSync('/tmp/permissions')
  fs.removeSync(TMP_DIRECTORY)
}

module.exports = {
  create: create,
  remove: remove,
  nothing: NOTHING,
  fixtures: {
    bmp:  FIXTURE_BMP,
    gif:  FIXTURE_GIF,
    jpg:  FIXTURE_JPG,
    jxr:  FIXTURE_JXR,
    png:  FIXTURE_PNG,
    webp: FIXTURE_WEBP,
    json: FIXTURE_JSON,
  },
  invalids: {
    json: INVALIDS_JSON
  },
  permissions: {
    user: {
      execute: USER_EXECUTE,
      read:    USER_READ,
      write:   USER_WRITE
    }
  },
  symlinks: {
    directory: SYMLINKS_DIRECTORY,
    nothing: SYMLINKS_NOTHING,
    png: SYMLINKS_PNG,
  },
  tmp: {
    directory: TMP_DIRECTORY
  },
  prog: PROG
}
