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
