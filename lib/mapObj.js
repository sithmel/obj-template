var mapValues = require('lodash/mapValues');

function mapObj(obj, cb, stack) {
  stack = stack || [];
  function map(o, key) {
    var newObj;
    o = cb(o, key);
    if (Array.isArray(o)) {
      return o.map(map);
    } else if (o.constructor === Object) {
      stack.push(o);
      newObj = mapValues(o, map);
      stack.pop();
      return newObj;
    } else {
      return o;
    }
  }
  return map(obj);
}

module.exports = mapObj;
