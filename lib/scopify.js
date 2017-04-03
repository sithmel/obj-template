// transform a stack of object in a single object, with overlapping scopes

module.exports = function (stack) {
  return stack.reduce(function (mainObj, currentObj) {
    var obj = Object.create(mainObj);
    Object.assign(obj, currentObj);
    return obj
  }, {});
  // var obj = {};
  // for(var i = 0; i < stack.length; i++) {
  //   // console.log(stack[i])
  //   obj = Object.create(obj);
  //   Object.assign(obj, stack[i]);
  // }
  // return obj;
};
