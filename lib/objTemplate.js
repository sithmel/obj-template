var bfsObj = require('./bfs-obj');
var scopify = require('../lib/scopify.js');
var template = require('lodash/template');
var cloneDeep = require('lodash/cloneDeep');

function objTemplate(data, opts) {
  opts = opts || {};
  templateFunc = opts.templateFunc || template;
  data = opts.dontclone ? data : cloneDeep(data);
  return bfsObj(data, function (value, key, stack) {
    return templateFunc(value)(scopify(stack, key));
  });
}

module.exports = objTemplate;
