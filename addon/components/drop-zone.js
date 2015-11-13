import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const { computed, observer, $, run, on, typeOf, debug, isPresent } = Ember;  // jshint ignore:line
const { defineProperty, get, set, inject, isEmpty, merge } = Ember; // jshint ignore:line
const a = Ember.A; // jshint ignore:line
const pascalize = thingy => thingy ? Ember.String.capitalize(Ember.String.camelize(thingy)) : thingy;
const camelizedTranslation = name => {
  // For consistency sake, allows all parameters to be camelcase in Ember
  const camels = [
    'dragStart', 'dragEnd', 'dragEnter', 'dragOver','dragLeave',
    'addedFile', 'removedFile', 'uploadProgress', 'maxFilesReached',
    'maxFilesExceeded','processingMultiple','sendingMultiple','successMultiple',
    'completeMultiple','canceledMultiple','totalUploadProgress','queueComplete'
  ];
  const translated = {};
  camels.forEach(item => {
    translated[item.toLowerCase()] = item;
  });

  return a(keys(translated)).contains(name) ? translated[name] : name;
};

// Configuration Objects
// > http://www.dropzonejs.com/#configuration
const configurationOptions = [
  'url', 'withCredentials', 'method', 'parallelUploads', 'maxFilesize', 'filesizeBase',
  'paramName', 'uploadMultiple', 'uploadMultiple', 'headers', 'addRemoveLinks', 'previewsContainer',
  'clickable', 'createImageThumbnails', 'maxThumbnailFilesize', 'thumbnailWidth', 'thumbnailHeight',
  'maxFiles', 'acceptedFiles', 'autoProcessQueue', 'forceFallback', 'previewTemplate'
];
const optionalCallbacks = [
  'init', 'accept', 'resize', 'fallback'
];
// Dropzone translations
// aka, text/html that shows up in various states
const translations = [
  'dictDefaultMessage', 'dictFallbackMessage', 'dictFallbackText', 'dictInvalidFileType',
  'dictFileTooBig', 'dictResponseError', 'dictCancelUpload', 'dictCancelUploadConfirmation',
  'dictRemoveFile', 'dictMaxFilesExceeded'
];
// All Configuration
const allConfiguration = [...configurationOptions, ...optionalCallbacks, ...translations];
// Events
// All of these receive the event as first parameter:
const dragEvents = [
  'drop', 'dragstart', 'dragend', 'dragenter',
  'dragover', 'dragleave'
];
// All of these receive the file as first parameter:
const fileEvents = [
  'addedfile','removedfile','thumbnail','error','processing',
  'uploadprogress','sending','succes','complete','canceled',
  'maxfilesreached', 'maxfilesexceeded'
];
// All of these receive a list of files as first parameter and are only
// called if the uploadMultiple option is true:
const multiFileEvents = [
  'processingmultiple','sendingmultiple','successmultiple',
  'completemultiple', 'canceledmultiple'
];
// Special Events
// note: note sure yet what "special" means
const specialEvents = [
  'totaluploadprogress', 'reset', 'queuecomplete'
];

export default Ember.Component.extend({
  classNames: ['dropzone'],

  // Default values
  url: '#', // note: this can be a function too
  autoProcessQueue: true,

  handlers: [],
  files: computed.alias('dz.dropzone.files'),
  getDropzoneOptions() {
    let dropzoneOptions = {};
    // add configuration
    a(allConfiguration).forEach(option => {
      const prop = this.get(option);
      if(isPresent(prop)) {
        dropzoneOptions[option] = prop;
      }
    });
    // Event Overrides
    // note: usually better to use the "additive" listening events rather than overriding
    // the exception to this rule is the "special events" from above which are intended to be provided
    // by the caller
    const allEvents = [...dragEvents, ...fileEvents, ...multiFileEvents, ...specialEvents];
    a(allEvents).forEach(event => {
      const prop = this.get(event) || this.get(camelizedTranslation(event));
      if(isPresent(prop)) {
        if(typeOf(prop) === 'function') {
          dropzoneOptions[event] = Ember.$.proxy(prop, this); // allow event to access Ember context
        } else {
          debug(`Event "${event}" was configured but was not a function, ignoreing.`);
        }
      }
    });

    return dropzoneOptions;
  },
  getDropzone() {
    return this.$().dropzone;
  },
  // check for non-camelized name first but then check camelized with 'on' prefix
  getHandler(event) {
    const emberStandardName = `on${pascalize(camelizedTranslation(event))}`;
    const dropzoneEvent = this.get(event);
    const emberEvent = this.get(emberStandardName);
    if (typeOf(dropzoneEvent) === 'function') { return dropzoneEvent; }
    if (typeOf(emberEvent) === 'function') { return emberEvent; }
    else { return null; }
  },

  insertDropzone: on('didInsertElement', function() {
    window.Dropzone.autoDiscover = false;
    const options = this.getDropzoneOptions();

    run.schedule('afterRender', () => {
      // Create dropzone object
      delete options.init; // TODO: look into why a function was inadvertently making it in here and causing problems
      let dropzone = this.$().dropzone(options);
      // Setup event listeners
      const allEvents = [...dragEvents, ...fileEvents, ...multiFileEvents, ...specialEvents];
      a(allEvents).forEach(event => {
        const handlerList = a(this.get('handlers'));
        const handler = this.getHandler(event);
        if (handler) {
          dropzone.on(event, $.proxy(handler,this));
          handlerList.pushObject(event);
        }
      });
      // Save object reference
      this.set('dz', dropzone[0]);
    });

    // if ( this.files && this.files.length > 0 ) {
    //   this.files.map( function( file ) {
    //     let dropfile = {
    //       name: file.get('name'),
    //       type: file.get('type'),
    //       size: file.get('size'),
    //       status: Dropzone.ADDED
    //     };
    //     let thumbnail = file.get('thumbnail');
    //
    //     if ( typeof(thumbnail) === 'string' ) {
    //
    //       dropfile.thumbnail = thumbnail;
    //     }
    //
    //     self.myDropzone.emit('addedfile', dropfile);
    //
    //     if ( typeof(thumbnail) === 'string' ) {
    //
    //       self.myDropzone.emit('thumbnail', dropfile, thumbnail);
    //     }
    //
    //     self.myDropzone.emit('complete', dropfile);
    //     self.myDropzone.files.push(file);
    //   });
    // }
  })
});
