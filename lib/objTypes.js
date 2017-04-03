var mapObj = require('./mapObj');

var defaultCreateInstance = {
  re: function (value) {
    return new RegExp(value);
  },
  date: function (value) {
    return new Date(value);
  }
};

var KEYSEPARATOR = '::';

function objTypes(data, createInstance, keySeparator) {
  keySeparator = keySeparator || KEYSEPARATOR;
  createInstance = Object.assign({}, defaultCreateInstance, createInstance);
  data = mapObj(data, function (value, k) {
    if (typeof k !== 'string') return value;
    var keyItems = k.split(keySeparator);
    if (keyItems.length > 1) {
      return createInstance[keyItems[1]](value);
    }
    return value;
  });

  return mapObj(data, function (value) {
    if (value.constructor === Object) {
      Object.keys(value)
      .forEach(function (k) {
        var keyItems = k.split(keySeparator);
        if (keyItems[0] !== k) {
          value[keyItems[0]] = value[k];
          delete value[k];
        }
      });
    }
    return value;
  });
}

module.exports = objTypes;
