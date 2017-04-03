var assert = require('chai').assert;
var objTemplateMain = require('..');

describe('objTemplateMain', function () {

  it('replace values', function () {
    var o1 = {
      'select::re': '/homepage',
      nav: [
        {
          title: 'homepage',
          selected: '<% if (select.exec("/homepage")) { %>selected<% } %>'
        },
        {
          title: 'secondpage',
          selected: '<% if (select.exec("/secondpage")) { %>selected<% } %>'
        }
      ]
    };
    var o2 = objTemplateMain(o1);
    assert.deepEqual(o2, {
      nav: [
        { title: 'homepage', selected: 'selected' },
        { title: 'secondpage', selected: '' }
      ],
      select: /\/homepage/
    });
  });
});
