var assert = require('chai').assert;
var objTemplate = require('../lib/objTemplate.js');

describe('objTemplate', function () {
  it('returns new object', function () {
    var o1 = {};
    var o2 = objTemplate(o1);
    assert.notEqual(o1, o2);
    assert.deepEqual(o1, o2);
  });

  it('returns new object (check deep)', function () {
    var o1 = {
      a: {},
      b: []
    };
    var o2 = objTemplate(o1);
    assert.deepEqual(o1, o2);
    assert.notEqual(o1.a, o2.a);
    assert.notEqual(o1.b, o2.b);
    assert.notEqual(o1, o2);
  });

  it('replace values', function () {
    var o1 = {
      a: 'hello',
      b: '<%= a %> world!'
    };
    var o2 = objTemplate(o1);
    assert.deepEqual(o2, {
      a: 'hello',
      b: 'hello world!'
    });
  });

  it('replace values (deep)', function () {
    var o1 = {
      a: ['hello', 'ciao'],
      b: '<%= a[1] %> world!'
    };
    var o2 = objTemplate(o1);
    assert.deepEqual(o2, {
      a: ['hello', 'ciao'],
      b: 'ciao world!'
    });
  });

  it('replace values (example)', function () {
    var o1 = {
      baseURL: 'http://www.example.com',
      urls: [
        "<%= baseURL %>/homepage",
        "<%= baseURL %>/menu",
        "<%= baseURL %>/contacts"
      ]
    };
    var o2 = objTemplate(o1);
    assert.deepEqual(o2, {
      baseURL: 'http://www.example.com',
      urls: [
        "http://www.example.com/homepage",
        "http://www.example.com/menu",
        "http://www.example.com/contacts"
      ]
    });
  });

  it('uses the scope', function () {
    var o1 = {
      fruit: 'apple',
      value: '1',
      test1: {
        value: '3',
        sentence: 'eating <%= value %> <%= fruit %>'
      },
      test2: {
        fruit: 'orange',
        sentence: 'eating <%= value %> <%= fruit %>'
      },
      test3: {
        sentence: 'eating <%= value %> <%= fruit %>'
      }
    };
    var o2 = objTemplate(o1);

    assert.deepEqual(o2, {
      fruit: 'apple',
      value: '1',
      test1: {
        value: '3',
        sentence: 'eating 3 apple'
      },
      test2: {
        fruit: 'orange',
        sentence: 'eating 1 orange'
      },
      test3: {
        sentence: 'eating 1 apple'
      }
    });
  });
});
