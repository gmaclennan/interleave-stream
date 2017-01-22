var interleave = require('./')
var split = require('split2')
var s1 = split()
var s2 = split()

interleave([s1, s2]).pipe(process.stdout)

s1.end('1\n2\n3')
s2.end('A\nB\nC')
