var bfsObj = require('./bfs-obj')
var scopify = require('../lib/scopify.js')
var template = require('lodash/template')
var cloneDeep = require('lodash/cloneDeep')

var re = new RegExp('<%.+%>')
function isLodashTemplate (s) {
  return !!re.exec(s)
}

function returnsTrue (s) {
  return true
}

function objTemplate (data, opts) {
  opts = opts || {}
  var templateFunc = opts.templateFunc || template
  data = opts.dontclone ? data : cloneDeep(data)
  var templateCache = opts.templateCache
  var isTemplate = opts.isTemplate
    ? opts.isTemplate
    : (opts.templateFunc ? returnsTrue : isLodashTemplate)
  return bfsObj(data, function (value, key, stack) {
    var scope
    if (!isTemplate(value)) {
      return value
    }

    scope = scopify(stack, key)

    if (!templateCache) {
      return templateFunc(value)(scope)
    } else {
      if (!(value in templateCache)) {
        templateCache[value] = templateFunc(value)
      }
      return templateCache[value](scope)
    }
  })
}

module.exports = objTemplate
