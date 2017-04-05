// transform a stack of object in a single object, with overlapping scopes
var omit = require('lodash/omit');

module.exports = function (stack, keyToExclude) {
  // remove current key from last item in the stack
  var patchedStack = stack;
  if (stack.length > 0 && typeof keyToExclude === 'string') {
    patchedStack = stack.slice(0, -1);
    patchedStack.push(omit(stack[stack.length - 1], keyToExclude));
  }

  return patchedStack.reduce(function (mainObj, currentObj) {
    var obj = Object.create(mainObj);
    Object.assign(obj, currentObj);
    return obj;
  }, { _stack: stack });
};
