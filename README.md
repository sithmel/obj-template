### obj-template

You run:
```js
var objTemplate = require('obj-template');

var config = {
  baseURL: 'http://www.example.com',
  urls: [
    "<%= baseURL %>/homepage",
    "<%= baseURL %>/menu",
    "<%= baseURL %>/contacts"
  ]
};

var newConfig = objTemplate(config);
```
and it returns a new object (it is a deep clone of the original object):

```js
{
  baseURL: 'http://www.example.com',
  urls: [
    "http://www.example.com/homepage",
    "http://www.example.com/menu",
    "http://www.example.com/contacts"
  ]
}
```
It can be useful to write short configuration objects, without being too repetitive.

objTemplate uses as default lodash "template" function. It can also take any equivalent function as a templateFunc in the options (the second argument):

```js
var handlebars = require('handlebars');
var objTemplate = require('obj-template');

var config = {
  baseURL: 'http://www.example.com',
  urls: [
    "{{baseURL}}/homepage",
    "{{baseURL}}/menu",
    "{{baseURL}}/contacts"
  ]
};

var newConfig = objTemplate(config, { templateFunc: handlebars.compile });
```
### isTemplate
Before converting a string to a template, the function checks if the string is a template. If you changed the templateFunc, you should also implement a function "isTemplate" that returns true if a string is a template.
```js
var handlebars = require('handlebars');
var objTemplate = require('obj-template');

function isHandlebars(s) {
  var re = new RegExp('{{.+}}');
  return !!re.exec(s);
}

var config = {
  baseURL: 'http://www.example.com',
  urls: [
    "{{baseURL}}/homepage",
    "{{baseURL}}/menu",
    "{{baseURL}}/contacts"
  ]
};

var newConfig = objTemplate(config, { templateFunc: handlebars.compile, isTemplate: isHandlebars });
```

### Scope
Every value is contained in a scope related to the object where is defined:
```js
var objTemplate = require('obj-template');

var config = {
  url: 'http://www.example.com',
  items: [
    {
      title: 'Section1',
      url: '<%= url %>/section1', // ignores the property with the same name of the current object
      navigation: [
        "<%= url %>/homepage", // use current object as scope
        "<%= url %>/menu",
        "<%= url %>/contacts"
      ]
    },
    {
      title: 'Section2',
      navigation: [
        "<%= url %>/homepage", // use root scope
        "<%= url %>/menu",
        "<%= url %>/contacts"
      ]
    }
  ]
};

var newConfig = objTemplate(config);
```
returns:
```js
var newConfig = {
  url: 'http://www.example.com',
  items: [
    {
      title: 'Section1',
      url: 'http://www.example.com/section1',
      navigation: [
        "http://www.example.com/section1/homepage",
        "http://www.example.com/section1/menu",
        "http://www.example.com/section1/contacts"
      ]
    },
    {
      title: 'Section2',
      navigation: [
        "http://www.example.com/homepage",
        "http://www.example.com/menu",
        "http://www.example.com/contacts"
      ]
    }
  ]
};
```
The algorithm ensure that the scope of the lowers level are done first (breadth first).
Take into consideration that within the same object there is a risk to reference a property that is still not ready. For example, this works:
```js
objTemplate({
  a : 'test',
  b: '<%= a %>',
  c: '<%= b %>'
});
```
This doesn't:
```js
objTemplate({
  a: '<%= b %>'
  b: '<%= c %>',
  c : 'test',
});
```
This risks is mitigated by the fact that most js implementations use the order in which properties are defined (with the exception of "numeric" keys). All js implementations use the same order consistently. ES6 standardised this way of ordering: http://2ality.com/2015/10/property-traversal-order-es6.html.
This reduces to the following advice:
* Take into consideration the order in which properties are defined in the object
* unless there are numeric keys (like "3" or "14" but unlike "03") because they are sorted in a different way

### stack
You can access to the current object stack using the special property _stack.
```js
{
  fruit: 'apple',
  test2: {
    fruit: 'orange',
    breadcrumbs: '<%= _stack.map(function (o) { return o.fruit; }).join(", ") %>'
  }
}
```
returns:
```js
{
  fruit: 'apple',
  test2: {
    fruit: 'orange',
    breadcrumbs: 'apple, orange'
  }
}
```

### dontclone
The function returns a new object, deep cloned from the original one. If you prefer to modify the original object you can pass "dontclone: true" in the options.
```js
var obj = {
  a : 'test',
  b: '<%= a %>'
};
objTemplate(obj, { dontclone: true });
```

### templateCache
This options inject a cache used for the templates. We have verified it can greatly increase the speed calling the function multiple times on a object containing the same strings (using handlebars for example).
```js
var obj = {
  a : 'test',
  b: '<%= a %>'
};
var templateCache = {};
objTemplate(obj, { templateCache: {} });
```
If you are not using the default templating engine (lodash template), to avoid unnecessary caching you should also pass a function "isTemplate" that returns true if a string is a template.
