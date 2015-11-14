# Ember-cli-dropzonejs

![ ](http://zippy.gfycat.com/FineBitterChital.gif)

[![Build Status](https://travis-ci.org/FutoRicky/ember-cli-dropzonejs.svg?branch=test%2Ftarvis-ci-implementation)](https://travis-ci.org/FutoRicky/ember-cli-dropzonejs)

Drag and drop file uploader addon for ember-cli using
 [Dropzonejs](http://www.dropzonejs.com/).

[DEMO](https://ember-cli-dropzonejs.firebaseapp.com)

Installation
-------------
`ember install ember-cli-dropzonejs`

then

`bower install dropzone`

This addon will use dropzone's default css by default. If you prefer to use your own css, add this option to your `ember-build.js`:

```javascript
var app = new EmberApp({
  ---
  emberCliDropzonejs: {
    includeDropzoneCss: false
  }
  ---
});
```


Usage
-------------
Simply add the component to your template like so: `{{drop-zone url='/endpoint'}}`

You can see all properties in the [Dropzonejs configuration docs](http://www.dropzonejs.com/#configuration).

To set properties simply add the name of the property inside the component call and assign a value.

example:

`{{drop-zone url='http://example.com/example' clickable=false addRemoveLinks=true}}`

**Remember to add an url, it will not work without it**
