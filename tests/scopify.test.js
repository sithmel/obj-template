var assert = require('chai').assert;
var scopify = require('../lib/scopify.js');

describe('scopify', function () {

  it('returns object composing scopes', function () {
    var stack = [
      { a: 1, b: 2 },
      { a: 2, c: 3 }
    ];
    var o = scopify(stack);
    assert.equal(o.a, 2);
    assert.equal(o.b, 2);
    assert.equal(o.c, 3);
  });

  it('returns empty object', function () {
    var stack = [];
    var o = scopify(stack);
    assert.deepEqual(o, {});
  });
});
