# fs-funcs

> A very limited subset of fs functions I use every day

## Install

```bash
npm i fs-funcs
```

Package [on npm](https://www.npmjs.com/package/fs-funcs)

## API

* [exec-file](#exec-filefile-args-options)
* [exec](#execcommand-options)
* [exist](#existpath-nofollow)
* [first-bytes](#first-bytespath-length)
* [get-filesize](#get-filesizepath)
* [is-directory](#is-directorypath-nothrow)
* [is-file](#is-filepath-nothrow)
* [is-symlink](#is-symlinkpath-nothrow)
* [mkdir](#mkdirpath-pop)
* [read-json](#read-jsonpath)
* [rm](#rmpath)
* [stat](#statpath-nofollow)
* [write-json](#write-jsonpath-data-minify)

---

### exec-file(file, [args], [options])

Execute the `file`

| Argument | Action |
| :------ | :------- |
| **file** | the executed `file` |
| **args** | the list of string arguments |
| **options** | optional `options`, default to `{ maxBuffer: 20971520 }` |

`args` can be an `Array` or a `String`

The default `maxBuffer` is 20 Mo instead of 200 ko

`result` is an object with two properties `{ stdout, stderr }`

The EOF chars `\n` or `\r\n` are removed from the returned strings `stdout` and `stderr`

```js
const execfile = require('fs-funcs/exec-file')

execfile('echo', ['one', 'two']).then(result => {
  // one two
  console.log(result.stdout)
})

execfile('echo', 'abc def').then(result => {
  // abc def
  console.log(result.stdout)
})
```

---

### exec(command, [options])

Execute the `command`

| Argument | Action |
| :------ | :------- |
| **command** | the executed `command` |
| **options** | optional `options`, default to `{ maxBuffer: 20971520 }` |

The default `maxBuffer` is 20 Mo instead of 200 ko

`result` is an object with two properties `{ stdout, stderr }`

The EOF chars `\n` or `\r\n` are removed from the returned strings `stdout` and `stderr`

```js
const exec = require('fs-funcs/exec')

exec('echo one two').then(result => {
  // one two
  console.log(result.stdout)
})
```

---

### exist(path, [nofollow])

Check if `path` exists

| Argument | Action |
| :------ | :------- |
| **path** | the tested `path` |
| **nofollow** | optional `nofollow`, default to `false`. If `true`, test the symlink and not is target |

```js
const exist = require('fs-funcs/exist')

exist(__filename).then(result => {
  // true
  console.log(result)
})
```

---

### first-bytes(path, [length])

Get a Buffer with the first bytes of a file

| Argument | Action |
| :------ | :------- |
| **path** | the file `path` |
| **length** | optional `length`, default to `15` |

```js
const firstbytes = require('fs-funcs/first-bytes')

firstbytes('/path/to/file').then(result => {
  // <Buffer 89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44>
  console.log(result)
})
```

---

### get-filesize(path)

Get the size of a file

| Argument | Action |
| :------ | :------- |
| **path** | the file `path` |

```js
const getfilesize = require('fs-funcs/get-filesize')

getfilesize('/path/to/file').then(result => {
  // 54318
  console.log(result)
})
```

---

### is-directory(path, [nothrow])

Check if `path` is a directory

| Argument | Action |
| :------ | :------- |
| **path** | the tested `path` |
| **nothrow** | optional `nothrow`, default to `false`. If `true`, resolve to `false` instead of throw an error |

```js
const isdirectory = require('fs-funcs/is-directory')

isdirectory('/path/to/directory').then(result => {
  // true
  console.log(result)
})

isdirectory('/path/to/file')
.then(result => {})
.catch(err => {
  // "path" argument must target a directory
  console.log(err.message)
})

isdirectory('/path/to/file', true).then(result => {
  // false
  console.log(result)
})
```

---

### is-file(path, [nothrow])

Check if `path` is a file


| Argument | Action |
| :------ | :------- |
| **path** | the tested `path` |
| **nothrow** | optional `nothrow`, default to `false`. If `true`, resolve to `false` instead of throw an error |

```js
const isfile = require('fs-funcs/is-file')

isfile('/path/to/file').then(result => {
  // true
  console.log(result)
})

isfile('/path/to/directory')
.then(result => {})
.catch(err => {
  // "path" argument must target a file
  console.log(err.message)
})

isfile('/path/to/directory', true).then(result => {
  // false
  console.log(result)
})
```

---

### is-symlink(path, [nothrow])

Check if `path` is a symlink

| Argument | Action |
| :------ | :------- |
| **path** | the tested `path` |
| **nothrow** | optional `nothrow`, default to `false`. If `true`, resolve to `false` instead of throw an error |

```js
const issymlink = require('fs-funcs/is-symlink')

issymlink('/path/to/symlink').then(result => {
  // true
  console.log(result)
})

issymlink('/path/to/file')
.then(result => {}).catch(err => {
  // "path" argument must target a symlink
  console.log(err.message)
})

issymlink('/path/to/file', true).then(result => {
  // false
  console.log(result)
})
```

---

### mkdir(path, [pop])

Recursively mkdir

| Argument | Action |
| :------ | :------- |
| **path** | the created `path` |
| **pop** | optional `pop`, default to `false`. If `true`, remove the last part of the `path` |

```js
const mkdir = require('fs-funcs/mkdir')

mkdir('/path/to/directory').then(result => {
  // /path/to/directory
  console.log(result)
})

mkdir('/path/to/file', true).then(result => {
  // /path/to
  console.log(result)
})
```

---

### read-json(path)

Read and serialize a JSON file

| Argument | Action |
| :------ | :------- |
| **path** | the file `path` |

```js
const readjson = require('fs-funcs/read-json')

readjson('/path/to/json').then(result => {
  // {a:123, b:"abc"}
  console.log(result)
})
```

---

### rm(path)

Remove a path

| Argument | Action |
| :------ | :------- |
| **path** | the removed `path` |

```js
const rm = require('fs-funcs/rm')

rm('/path/to/directory').then(result => {
  // /path/to/directory
  console.log(result)
})
```

---

### stat(path, [nofollow])

Get some data about `path`

| Argument | Action |
| :------ | :------- |
| **path** | the tested `path` |
| **nofollow** | optional `nofollow`, default to `false`. If `true`, test the symlink and not is target |

The booleans `readable`, `writable` and `executable` are related to the **user** privileges

```js
const stat = require('fs-funcs/stat')

stat('/path/to/file').then(result => {
  /*
  {
    file: true,
    directory: false,
    symlink: false,
    path: '/path/to/file',
    dirname: '/path/to',
    basename: 'file',
    size: 123,
    readable: true,
    writable: true,
    executable: false
  }
  */
  console.log(result)
})

stat('/path/to/directory').then(result => {
  /*
  {
    file: false,
    directory: true,
    symlink: false,
    path: '/path/to/directory',
    dirname: '/path/to',
    basename: 'directory',
    size: 7,
    readable: true,
    writable: true,
    executable: true
  }
  */
  console.log(result)
})
```

---

### write-json(path, data, [minify])

Write a prettified JSON file. The directory tree is created if needed

| Argument | Action |
| :------ | :------- |
| **path** | the created `path` |
| **data** | the stringified `data` |
| **minify** | optional `minify`, default to `false`. If `true`, the JSON will not be beautified |

```js
const writejson = require('fs-funcs/write-json')

writejson('/path/to/json', {a:123, b:"abc"}).then(result => {
  // {a:123, b:"abc"}
  console.log(result)
})
```

## License

MIT
