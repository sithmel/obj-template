var mapValues = require('lodash/mapValues');
var template = require('lodash/template');

function mapObj(obj, cb) {
  function map(o) {
    o = cb(o);
    if (Array.isArray(o)) {
      return o.map(map);
    } else if (typeof o === 'object') {
      return mapValues(o, map);
    } else {
      return o;
    }
  }
  return map(obj);
}

function objTemplate(data, templateFunc) {
  templateFunc = templateFunc || template;
  return mapObj(data, function (value) {
    if (typeof value === 'string') {
      return templateFunc(value)(data);
    } else {
      return value;
    }
  });
}

module.exports = objTemplate;
