var assert = require('chai').assert;
var objTypes = require('../lib/objTypes.js');

describe('objTypes', function () {

  it('returns new object', function () {
    var o1 = {
      a: 'hello'
    };
    var o2 = objTypes(o1);
    assert.deepEqual(o1, o2);
    assert.notEqual(o1, o2);
  });

  it('deserialises', function () {
    var o1 = {
      a: 'hello',
      'b::re': 'hello',
      'c::date': 'Fri Mar 31 2017 22:05:11 GMT+0100 (BST)'
    };
    var o2 = objTypes(o1);
    assert.deepEqual(o2, {
      a: 'hello',
      b: new RegExp('hello'),
      c: new Date('Fri Mar 31 2017 22:05:11 GMT+0100 (BST)'),
    });
  });

  it('deserialises nested objects', function () {
    var o1 = {
      a: {
        'b::re': 'hello',
        'c::date': 'Fri Mar 31 2017 22:05:11 GMT+0100 (BST)'
      },
    };
    var o2 = objTypes(o1);
    assert.deepEqual(o2, {
      a: {
        b: new RegExp('hello'),
        c: new Date('Fri Mar 31 2017 22:05:11 GMT+0100 (BST)'),
      },
    });
  });

});
