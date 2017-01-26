var test = require('tape')
var callback = require('callback-stream')
var split = require('split2')
var from = require('from2-array')

var interleave = require('./')

function toString (buf) {
  return buf.toString()
}

test('basic usage', function (t) {
  var s1 = split()
  var s2 = split()
  var s3 = split()

  interleave([s1, s2, s3]).pipe(callback(function (err, data) {
    t.error(err)
    t.deepEqual(data.map(toString), ['1', 'A', 'α', '2', 'B', 'β', '3', 'C', 'γ'])
    t.end()
  }))

  s1.end('1\n2\n3')
  s2.end('A\nB\nC')
  s3.end('α\nβ\nγ')
})

test('uneven length', function (t) {
  var s1 = split()
  var s2 = split()
  var s3 = split()

  interleave([s1, s2, s3]).pipe(callback(function (err, data) {
    t.error(err)
    t.deepEqual(data.map(toString), ['1', 'A', 'α', '2', 'B', 'β', '3', 'γ', '4'])
    t.end()
  }))

  s1.end('1\n2\n3\n4')
  s2.end('A\nB')
  s3.end('α\nβ\nγ')
})

test('object mode', function (t) {
  var s1 = from.obj([1, 2, 3, 4])
  var s2 = from.obj(['A', 'B'])
  var s3 = from.obj(['α', 'β', 'γ'])

  interleave.obj([s1, s2, s3]).pipe(callback.obj(function (err, data) {
    t.error(err)
    t.deepEqual(data, [1, 'A', 'α', 2, 'B', 'β', 3, 'γ', 4])
    t.end()
  }))
})

test('hwm object mode', function (t) {
  var o1 = Array(40).fill(0)
  var o2 = Array(40).fill(1)
  var expected = Array(80).fill(null).map(function (v, i) {
    return i % 2
  })
  interleave.obj([from.obj(o1), from.obj(o2)]).pipe(callback.obj(function (err, data) {
    t.error(err)
    t.deepEqual(data, expected)
    t.end()
  }))
})

