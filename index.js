var objTemplate = require('./lib/objTemplate');
var objTypes = require('./lib/objTypes');

module.exports = function (data) {
  data = (typeof data === 'string') ? JSON.parse(data) : data;
  data = objTypes(data);
  return objTemplate(data);
};
