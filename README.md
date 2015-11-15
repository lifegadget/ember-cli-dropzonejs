# ui-dropzone

![ ](http://zippy.gfycat.com/FineBitterChital.gif)

Drag and drop file uploader addon for ember-cli using [Dropzonejs](http://www.dropzonejs.com/).

[DEMO](https://ui-dropzone.firebaseapp.com)

## Installation

From your project's root folder:

     ember install ui-dropzone

This will install the bower based **dropzonejs** library and you're ready to go.

> Note: if you'd prefer to use your own css and not dropzone's you can disable it in your `ember-cli-build.js` file:

    var app = new EmberApp({
      emberCliDropzone: {
        includeDropzoneCss: false
      }
    });

## Usage

Just add the component to your template:

    {{drop-zone url='http://www.server.com/endpoint'}}

For all other instruction review the interactive [demo](https://ui-dropzone.firebaseapp.com) or the [DropzoneJS documentation](http://www.dropzonejs.com/).

## History

The history of this addon starts with all the great DropzoneJS work, it then was brought to Ember by [Ricardo Mercado](https://github.com/FutoRicky). I forked this code because I needed to extend it enough that I felt it was better to have it evolve separately. 
