var mapValues = require('lodash/mapValues');

function mapObj(obj, cb) {
  function map(o, key) {
    o = cb(o, key);
    if (Array.isArray(o)) {
      return o.map(map);
    } else if (o.constructor === Object) {
      return mapValues(o, map);
    } else {
      return o;
    }
  }
  return map(obj);
}

module.exports = mapObj;
