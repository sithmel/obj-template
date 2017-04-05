var bfsObj = require('./bfs-obj');
var template = require('lodash/template');
var scopify = require('../lib/scopify.js');

function objTemplate(data, templateFunc) {
  templateFunc = templateFunc || template;
  return bfsObj(data, function (value, key, stack) {
    return templateFunc(value)(scopify(stack, key));
  });
}

module.exports = objTemplate;
