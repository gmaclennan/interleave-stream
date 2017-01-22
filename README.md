# interleave-stream

[![npm](https://img.shields.io/npm/v/interleave-stream.svg)](https://www.npmjs.com/package/interleave-stream)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?maxAge=2592000)](http://standardjs.com/)

> Interleave multiple input streams into a single stream

Will emit chunks from input streams in order, e.g. `[s1chunk1, s2chunk1, s3chunk1, s1chunk2, s2chunk2, etc..]`. Use [split](https://www.npmjs.com/package/split2) or [block-stream2](https://github.com/substack/block-stream2) in order to control chunks from input streams.

## Install

```
npm install -S interleave-stream
```

## Usage

```js
var interleave = require('interleave-stream')
var split = require('split2')
var s1 = split()
var s2 = split()

interleave([s1, s2]).pipe(process.stdout)

s1.end('1\n2\n3')
s2.end('A\nB\nC')

// outputs `1A2B3C` to stdout
```

## API

```js
var interleave = require('interleave-stream')
```

### interleave(streams, opts)

Where:

- `streams` is an array of readable streams
- `opts` is the same as the options for [ReadableStream](https://nodejs.org/dist/latest-v6.x/docs/api/stream.html#stream_new_stream_readable_options)

Returns a ReadableStream that interleaves chunks from input streams in order.

### interleave.obj(streams, opts)

For objectMode streams.

## Contribute

PRs accepted.

Small note: If editing the Readme, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

MIT © Gregor MacLennan
