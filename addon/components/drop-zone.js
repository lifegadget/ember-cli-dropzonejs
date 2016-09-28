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
    'addedFile', 'removedFile', 'uploadProgress', 'maxFilesReached', 'maxFileSize',
    'maxFilesExceeded','processingMultiple','sendingMultiple','successMultiple',
    'completeMultiple','canceledMultiple','totalUploadProgress','queueComplete'
  ];
  const translated = {};
  camels.forEach(item => {
    translated[item.toLowerCase()] = item;
  });

  return a(keys(translated)).includes(name) ? translated[name] : name;
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
  'initialise', 'accept', 'resize', 'fallback'
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
  'uploadprogress','sending','success','complete','canceled',
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
// maps template names to the API
const templateLookup = {
  preview: 'previewTemplate',
  "default-message": 'dictDefaultMessage',
  "fallback-message": 'dictFallbackMessage',
  "invalid-file-type": 'dictInvalidFileType',
  "file-too-big": 'dictFileTooBig'
};

import xhrIntercept from 'ui-dropzone/mixins/xhr-intercept';
import layout from '../templates/components/drop-zone';

export default Ember.Component.extend(xhrIntercept,{
  layout: layout,
  classNames: ['dropzone'],
  propertyNamesBindings: ['ariaRole'],
  ariaRole: 'input',

  // Default values
  url: '#', // note: this can be a function too
  autoProcessQueue: true,

  // Download file to browser but keep local to browser
  keepLocal: false,
  _keepLocal: on('init', function() {
    const keepLocal = this.get('keepLocal');
    if(keepLocal) {
      this.accept = this.localAcceptHandler;
    }
  }),
  // Switch away from built-in way of sending
  // and use AJAX instead
  useAjax: false,

  // Config counters
  handlers: computed(()=> { return a(); }),
  overwriteHandlers: computed(()=> { return a(); }),
  customTemplates: computed(()=> { return a(); }),
  localPayloads: computed(()=> { return a(); }),

  getDropzoneOptions() {
    let dropzoneOptions = {};
    dropzoneOptions.init = null;
    // add configuration
    a(allConfiguration).forEach(option => {
      const prop = this.get(option);
      const namedOption = option === 'intialize' ? 'init' : option; // avoids conflict with Ember's 'init()'
      if(isPresent(prop)) {
        dropzoneOptions[namedOption] = prop;
      }
    });
    // Event Overrides
    // note: usually better to use the "additive" listening events rather than overriding
    const allEvents = [...dragEvents, ...fileEvents, ...multiFileEvents, ...specialEvents, ...optionalCallbacks];
    const overwriteHandlers = this.get('overwriteHandlers');
    a(allEvents).forEach(event => {
      const prop = this.get(event) || this.get(camelizedTranslation(event));
      if(isPresent(prop)) {
        overwriteHandlers.pushObject(event);
        if(typeOf(prop) === 'function') {
          dropzoneOptions[event] = Ember.$.proxy(prop, this); // allow event to access Ember context
        } else {
          debug(`Event "${event}" was configured but was not a function, ignoreing.`);
        }
      }
    });

    return dropzoneOptions;
  },
  // check for non-caemojiSuccess first but then check camelized with 'on' prefix
  getHandler(event) {
    const emberStandardName = `on${pascalize(camelizedTranslation(event))}`;
    const emberEvent = this.get(emberStandardName);
    if (typeOf(emberEvent) === 'function') { return emberEvent; }
    else { return null; }
  },

  insertDropzone: on('didInsertElement', function() {
    window.Dropzone.autoDiscover = false;
    run.schedule('afterRender', () => {
      const options = this.getDropzoneOptions();
      // Create dropzone object
      delete options.init; // TODO: look into why a function was inadvertently making it in here and causing problems
      this.$().dropzone(options);
      let dropzone = this.$()[0].dropzone;
      // Setup event listeners
      const allEvents = [...dragEvents, ...fileEvents, ...multiFileEvents, ...specialEvents];
      const handlerList = this.get('handlers');
      a(allEvents).forEach(event => {
        const handler = this.getHandler(event);
        if (handler) {
          dropzone.on(event, $.proxy(handler,this));
          handlerList.pushObject(event);
        }
      });
      // Save object reference
      this.set('dropzone', dropzone);
      // local override
      if(this.keepLocal) {
        run.next(() => {
          this._stubSubmitRequest();
        });
      }
      // ajax override
      if(this.useAjax) {
        run.next(() => {
          this._ajaxSubmitRequest();
        });
      }
      this.loadPreExistingFiles();
    });

  }),
  loadPreExistingFiles() {
    // TODO: implement

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
  },
  registerTemplate(type, content) {
    // let templates = this.get('customTemplates');
    // templates[type] = content; // this may be redundant but keeping for now

    if (templateLookup[type]) {
      this.set(templateLookup[type],content);
    } else {
      debug(`Recieved an unknown template type: "${type}"`);
    }

    return this.elementId;
  },
  contextualiseRegistration: on('init', function() {
    this.set('_registerTemplate', $.proxy(this.get('registerTemplate'), this));
  })

});
