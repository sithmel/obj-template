var mapObj = require('./mapObj');
var template = require('lodash/template');

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
