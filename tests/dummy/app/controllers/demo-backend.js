import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const { computed, observer, $, run, on, typeOf, debug, isPresent } = Ember;  // jshint ignore:line
const { defineProperty, get, set, inject, isEmpty, merge } = Ember; // jshint ignore:line
const a = Ember.A; // jshint ignore:line

export default Ember.Controller.extend({
  flashMessages: inject.service(),
  items: [
    { id: 'basic', title: 'Basic' },
    { id: 'backend', title: 'Backend' },
    { id: 'ember-data', title: 'Ember Data' },
  ],
  selected: 'basic',

  isPrivate: false,
  requestBin: null,
  requestUrl: computed('requestBin.name', function() {
    const bin = this.get('requestBin.name');
    return bin ? `http://requestb.in/${bin}` : null;
  }),
  requestInspector: computed('requestUrl', function() {
    const url = this.get('requestUrl');
    return url ? `${url}?inspect` : null;
  }),
  _requestBin: on('init', function() {
    return $.ajax({
      url: 'http://requestb.in/api/v1/bins',
      method: 'POST',
      crossDomain: true,

      data: {
        'private': this.get('isPrivate')
      },
      'success': (data) => {
        this.set('requestBin', data);
        // window.location.href = "/" + data['name'] + "?inspect";
      }
    });
  }),
  addedFile(file) {
    console.log(file,this);
    const flashMessages = Ember.get(this, 'flashMessages');
    flashMessages.info(`File "${file.name}" Uploaded.`);
  },
  sending(file, xhr, formData) {
    // debugger;
  }
});
