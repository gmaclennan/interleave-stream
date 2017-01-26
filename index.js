var to = require('flush-write-stream')
var from = require('from2')
var EventEmitter = require('events')

module.exports = interleave

module.exports.obj = obj

function interleave (streams, opts) {
  opts = opts || {}
  var hwm = opts.highWaterMark || 16384
  var emitter = new EventEmitter()
  var buffer = []
  var wanted = 0
  var pending = streams.length
  var readable = from(opts, read)

  function read (size, next) {
    if (!buffer.length && pending === 0) return next(null, null)
    if (!buffer.length) {
      return emitter.once('data', function () {
        read(size, next)
      })
    }
    var chunk = buffer.shift()
    if (!isFull(buffer)) emitter.emit('thirsty')
    next(null, chunk)
  }

  streams.forEach(function (stream, i) {
    stream.pipe(collector(i))
      .on('error', onError)
  })

  return readable

  function onError (err) {
    readable.emit('error', err)
  }

  function collector (i) {
    return to(opts, write, flush)

    function write (data, enc, next) {
      if (wanted === i) {
        buffer.push(data)
        wanted = (wanted + 1) % streams.length
        emitter.emit('data')
        if (!isFull(buffer)) {
          next()
        } else {
          emitter.once('thirsty', function () {
            next()
          })
        }
      } else {
        emitter.once('data', function () {
          write(data, enc, next)
        })
      }
    }

    function flush (cb) {
      wanted = (wanted + 1) % streams.length
      pending--
      emitter.emit('data')
      cb()
    }
  }

  function isFull (arr) {
    if (opts.objectMode) return arr.length >= hwm
    return arr.reduce(function (acc, cur) {
      return acc + cur.length
    }, 0) >= hwm
  }
}

function obj (streams, opts) {
  opts = opts || {}
  opts.objectMode = true
  opts.highWaterMark = 16
  return interleave(streams, opts)
}
