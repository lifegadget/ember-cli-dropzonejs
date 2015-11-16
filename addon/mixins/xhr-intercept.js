import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const { computed, observer, $, run, on, typeOf, debug, isPresent } = Ember;  // jshint ignore:line
const { defineProperty, get, set, inject, isEmpty, RSVP, merge } = Ember; // jshint ignore:line
const a = Ember.A; // jshint ignore:line

const _textTypes = ['text/*', 'application/xml', 'application/x-sh', 'application/x-script', 'image/svg+xml'];

export default Ember.Mixin.create({
  /**
   * Replaces the XHR's send operation so that the stream can be
   * retrieved on the client side instead being sent to the server.
   * The function name is a little confusing (other than it replaces the "send"
   * from Dropzonejs) because really what it's doing is reading the file and
   * NOT sending to the server.
   */
  _sendIntercept(file, options={}) {
    return new RSVP.Promise((resolve,reject) => {
      if(!options.readType) {
        const mime = file.type;
        const textType = a(_textTypes).any(type => {
          const re = new RegExp(type);
          return re.test(mime);
        });
        options.readType = textType ? 'readAsText' : 'readAsDataURL';
      }
      let reader = new window.FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = () => {
        reject(reader.result);
      };

      // run the reader
      reader[options.readType](file);
    });
  },

  /**
   * Will replace the Dropzone acceptance handler if user
   * sets the 'keepLocal' flag to true. Once a result is available
   * it will look for the `localSuccess` or `localFailure` handlers
   * if it does not find them it will simple use Dropzone's done()
   * callback directly
   */
  localAcceptHandler(file, done) {
    this._sendIntercept(file).then(result => {
      file.contents = result;
      if(typeOf(this.localSuccess) === 'function') {
        this.localSuccess(file, done);
      } else {
        done(); // empty done signals success
      }
    }).catch(result => {
      if(typeOf(this.localFailure) === 'function') {
        file.contents = result;
        this.localFailure(file, done);
      } else {
        done(`Failed to download file ${file.name}`);
        console.warn(file);
      }
    });
  },

  _stubSubmitRequest() {
    this.dropzone.submitRequest = function(xhr, formData, files) {
      this._finished(files,'locally resolved, refer to "contents" property');
    };
  },

  /**
   * Rather than letting Dropzone send it's own XHR request we'll take over that
   * responsibility here to get around CORS issues when needed. This is activated by
   * setting the components "useAjax" property to true.
   */
  _ajaxSubmitRequest() {
    this.dropzone.submitRequest = $.proxy(function(xhr, formData, files) {  //jshint ignore:line
      this._sendIntercept(files[0]).then(data => {
        $.ajax({
          url: this.url,
          method: 'POST',
          crossDomain: true,
          data: data,
          success: xhr.onload,
          error: xhr.onerror
        });
      });
    }, this);
  },


});
