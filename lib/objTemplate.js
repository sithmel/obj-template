var mapObj = require('./mapObj');
var template = require('lodash/template');
var scopify = require('../lib/scopify.js');

function objTemplate(data, templateFunc) {
  templateFunc = templateFunc || template;
  var stack = [];
  return mapObj(data, function (value) {
    if (typeof value === 'string') {
      return templateFunc(value)(scopify(stack));
    } else {
      return value;
    }
  }, stack);
}

module.exports = objTemplate;
