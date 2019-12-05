var assert = require('chai').assert
var objTemplate = require('../lib/objTemplate.js')
var handlebars = require('handlebars')

describe('objTemplate', function () {
  it('returns new object', function () {
    var o1 = {}
    var o2 = objTemplate(o1)
    assert.notEqual(o1, o2)
    assert.deepEqual(o1, o2)
  })

  it('does not clone the object', function () {
    var o1 = {}
    var o2 = objTemplate(o1, { dontclone: true })
    assert.equal(o1, o2)
  })

  it('returns new object (check deep)', function () {
    var o1 = {
      a: {},
      b: []
    }
    var o2 = objTemplate(o1)
    assert.deepEqual(o1, o2)
    assert.notEqual(o1.a, o2.a)
    assert.notEqual(o1.b, o2.b)
    assert.notEqual(o1, o2)
  })

  it('replace values', function () {
    var o1 = {
      a: 'hello',
      b: '<%= a %> world!'
    }
    var o2 = objTemplate(o1)
    assert.deepEqual(o2, {
      a: 'hello',
      b: 'hello world!'
    })
  })

  it('replace values using different template engines', function () {
    var o1 = {
      a: 'hello',
      b: '{{a}} world!'
    }
    var o2 = objTemplate(o1, { templateFunc: handlebars.compile })
    assert.deepEqual(o2, {
      a: 'hello',
      b: 'hello world!'
    })
  })

  it('replace values using different template engines and isTemplate', function () {
    var o1 = {
      a: 'hello',
      b: '{{a}} world!',
      c: '-{{b}} do not render'
    }
    var o2 = objTemplate(o1, { templateFunc: handlebars.compile, isTemplate: function (s) { return s[0] !== '-' } })
    assert.deepEqual(o2, {
      a: 'hello',
      b: 'hello world!',
      c: '-{{b}} do not render'
    })
  })

  it('replace values (dontclone)', function () {
    var o1 = {
      a: 'hello',
      b: '<%= a %> world!'
    }
    objTemplate(o1, { dontclone: true })
    assert.deepEqual(o1, {
      a: 'hello',
      b: 'hello world!'
    })
  })

  it('replace values caching templates', function () {
    var o1 = {
      a: 'hello',
      b: '<%= a %> world!'
    }
    var o2 = objTemplate(o1, { templateCache: {} })
    assert.deepEqual(o2, {
      a: 'hello',
      b: 'hello world!'
    })
  })

  it('replace values (deep)', function () {
    var o1 = {
      a: ['hello', 'ciao'],
      b: '<%= a[1] %> world!'
    }
    var o2 = objTemplate(o1)
    assert.deepEqual(o2, {
      a: ['hello', 'ciao'],
      b: 'ciao world!'
    })
  })

  it('replace values (example)', function () {
    var o1 = {
      baseURL: 'http://www.example.com',
      urls: [
        '<%= baseURL %>/homepage',
        '<%= baseURL %>/menu',
        '<%= baseURL %>/contacts'
      ]
    }
    var o2 = objTemplate(o1)
    assert.deepEqual(o2, {
      baseURL: 'http://www.example.com',
      urls: [
        'http://www.example.com/homepage',
        'http://www.example.com/menu',
        'http://www.example.com/contacts'
      ]
    })
  })

  it('uses the scope and stack', function () {
    var o1 = {
      fruit: 'apple',
      value: '1',
      test1: {
        value: '3',
        sentence: 'eating <%= value %> <%= fruit %>'
      },
      test2: {
        fruit: 'orange',
        sentence: 'eating <%= value %> <%= fruit %>',
        breadcrumbs: '<%= _stack.map(function (o) { return o.fruit; }).join(", ") %>'
      },
      test3: {
        sentence: 'eating <%= value %> <%= fruit %>'
      }
    }
    var o2 = objTemplate(o1)

    assert.deepEqual(o2, {
      fruit: 'apple',
      value: '1',
      test1: {
        value: '3',
        sentence: 'eating 3 apple'
      },
      test2: {
        fruit: 'orange',
        sentence: 'eating 1 orange',
        breadcrumbs: 'apple, orange'
      },
      test3: {
        sentence: 'eating 1 apple'
      }
    })
  })

  it('uses the scope (field itself corner case)', function () {
    var o1 = {
      url: 'http://www.example.com',
      items: [
        {
          title: 'Section1',
          url: '<%= url %>/section1',
          navigation: [
            '<%= url %>/homepage',
            '<%= url %>/menu',
            '<%= url %>/contacts'
          ]
        },
        {
          title: 'Section2',
          navigation: [
            '<%= url %>/homepage',
            '<%= url %>/menu',
            '<%= url %>/contacts'
          ]
        }
      ]
    }
    var o2 = objTemplate(o1)

    assert.deepEqual(o2, {
      url: 'http://www.example.com',
      items: [
        {
          title: 'Section1',
          url: 'http://www.example.com/section1',
          navigation: [
            'http://www.example.com/section1/homepage',
            'http://www.example.com/section1/menu',
            'http://www.example.com/section1/contacts'
          ]
        },
        {
          title: 'Section2',
          navigation: [
            'http://www.example.com/homepage',
            'http://www.example.com/menu',
            'http://www.example.com/contacts'
          ]
        }
      ]
    })
  })

  describe('current obj precedence', function () {
    it('precedence 1', function () {
      var o1 = {
        a: 'test',
        b: '<%= a %>',
        c: '<%= b %>'
      }

      var o2 = objTemplate(o1)

      assert.deepEqual(o2, {
        a: 'test',
        b: 'test',
        c: 'test'
      })
    })

    it('precedence 2', function () {
      var o1 = {
        c: 'test',
        b: '<%= c %>',
        a: '<%= b %>'
      }

      var o2 = objTemplate(o1)

      assert.deepEqual(o2, {
        a: 'test',
        b: 'test',
        c: 'test'
      })
    })
  })
})
