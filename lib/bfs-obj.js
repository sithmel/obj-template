var forEach = require('lodash/forEach')

function isObj (o) {
  try {
    return typeof o === 'object' && o.constructor === Object
  } catch (e) {
    return false
  }
}

function createStack (stack, o) {
  var newStack
  if (!isObj(o)) {
    return stack
  }
  newStack = stack.slice(0)
  newStack.push(o)
  return newStack
}

module.exports = function bfsObj (obj, cb) {
  var item
  var queue = [] // used for breadth first search
  queue.push({
    obj: obj,
    stack: createStack([], obj)
  })

  while (queue.length) {
    item = queue.shift()
    forEach(item.obj, function (value, key) {
      if (typeof value === 'string') {
        item.obj[key] = cb(value, key, item.stack)
      } else if (Array.isArray(value) || isObj(value)) {
        queue.push({
          obj: value,
          stack: createStack(item.stack, value)
        })
      }
    })
  }
  return obj
}
