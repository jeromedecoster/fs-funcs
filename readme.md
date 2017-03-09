# fs-funcs

> A very limited subset of fs functions I use every day

## Install

```bash
npm i fs-funcs
```

Package [on npm](https://www.npmjs.com/package/fs-funcs)

## API

* [exist](#existpath-nofollow)
* [first-bytes](#first-bytespath-length)
* [get-filesize](#get-filesizepath)
* [image-type](#image-typepath)
* [is-bmp](#is-bmppath)
* [is-directory](#is-directorypath-nothrow)
* [is-file](#is-filepath-nothrow)
* [is-gif](#is-gifpath)
* [is-image](#is-imagepath)
* [is-jpg](#is-jpgpath)
* [is-jxr](#is-jxrpath)
* [is-png](#is-pngpath)
* [is-symlink](#is-symlinkpath-nothrow)
* [is-webp](#is-webppath)
* [mkdir](#mkdirpath-pop)
* [read-json](#read-jsonpath)
* [rm](#rmpath)
* [stat](#statpath-nofollow)
* [write-json](#write-jsonpath-data)

#### exist(path, [nofollow])

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

#### first-bytes(path, [length])

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

#### get-filesize(path)

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

#### image-type(path)

Get the type of an image by reading his header

| Argument | Action |
| :------ | :------- |
| **path** | the file `path` |

The recognized types are
* bmp
* gif
* jpg
* jxr
* png
* webp

```js
const imagetype = require('fs-funcs/image-type')

imagetype('/path/to/png').then(result => {
  // png
  console.log(result)
})

imagetype('/path/to/psd').then(result => {
  // null
  console.log(result)
})
```

#### is-bmp(path)

Check if a file is a bmp

| Argument | Action |
| :------ | :------- |
| **path** | the tested `path` |

```js
const isbmp = require('fs-funcs/is-bmp')

isbmp('/path/to/bmp').then(result => {
  // true
  console.log(result)
})
```

#### is-directory(path, [nothrow])

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

isdirectory('/path/to/file').then(result => {
}).catch(err => {
  // "path" argument must target a directory
  console.log(err.message)
})

isdirectory('/path/to/file', true).then(result => {
  // false
  console.log(result)
})
```

#### is-file(path, [nothrow])

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

isfile('/path/to/directory').then(result => {
}).catch(err => {
  // "path" argument must target a file
  console.log(err.message)
})

isfile('/path/to/directory', true).then(result => {
  // false
  console.log(result)
})
```

#### is-gif(path)

Check if `path` is a gif

| Argument | Action |
| :------ | :------- |
| **path** | the tested `path` |

```js
const isgif = require('fs-funcs/is-gif')

isgif('/path/to/gif').then(result => {
  // true
  console.log(result)
})
```

#### is-image(path)

Check if `path` is an image

| Argument | Action |
| :------ | :------- |
| **path** | the tested `path` |

The recognized types are
* bmp
* gif
* jpg
* jxr
* png
* webp

```js
const isimage = require('fs-funcs/is-image')

isimage('/path/to/image').then(result => {
  // true
  console.log(result)
})
```

#### is-jpg(path)

Check if `path` is a jpg

| Argument | Action |
| :------ | :------- |
| **path** | the tested `path` |

```js
const isjpg = require('fs-funcs/is-jpg')

isjpg('/path/to/jpg').then(result => {
  // true
  console.log(result)
})
```

#### is-jxr(path)

Check if `path` is a jxr

| Argument | Action |
| :------ | :------- |
| **path** | the tested `path` |

```js
const isjxr = require('fs-funcs/is-jxr')

isjxr('/path/to/jxr').then(result => {
  // true
  console.log(result)
})
```

#### is-png(path)

Check if `path` is a png

| Argument | Action |
| :------ | :------- |
| **path** | the tested `path` |

```js
const ispng = require('fs-funcs/is-png')

ispng('/path/to/png').then(result => {
  // true
  console.log(result)
})
```

#### is-symlink(path, [nothrow])

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

issymlink('/path/to/file').then(result => {
}).catch(err => {
  // "path" argument must target a symlink
  console.log(err.message)
})

issymlink('/path/to/file', true).then(result => {
  // false
  console.log(result)
})
```

#### is-webp(path)

Check if `path` is a webp

| Argument | Action |
| :------ | :------- |
| **path** | the tested `path` |

```js
const iswebp = require('fs-funcs/is-webp')

iswebp('/path/to/webp').then(result => {
  // true
  console.log(result)
})
```

#### mkdir(path, [pop])

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

#### read-json(path)

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

#### rm(path)

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

#### stat(path, [nofollow])

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
    size: 7,
    readable: true,
    writable: true,
    executable: true
  }
  */
  console.log(result)
})
```

#### write-json(path, data)

Write a prettified JSON file. The directory tree is created if needed

| Argument | Action |
| :------ | :------- |
| **path** | the created `path` |
| **data** | the stringified `data` |

```js
const writejson = require('fs-funcs/write-json')

writejson('/path/to/json', {a:123, b:"abc"}).then(result => {
  // {a:123, b:"abc"}
  console.log(result)
})
```

## License

MIT
