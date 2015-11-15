import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const { computed, observer, $, run, on, typeOf, debug, isPresent } = Ember;  // jshint ignore:line
const { defineProperty, get, set, inject, isEmpty, merge } = Ember; // jshint ignore:line
const a = Ember.A; // jshint ignore:line

export default Ember.Controller.extend({
  flashMessages: inject.service(),

  _selected: observer('selected', function() {
    this.transitionToRoute('demo-' + this.get('selected'));
  }),
  addedFile(file) {
    console.log('added: ', file,this);
    const flashMessages = Ember.get(this, 'flashMessages');
    flashMessages.info(`File "${file.name}" Uploaded.`);
  },
  removedFile(file) {
    console.log('removed: ',file,this);
    const flashMessages = Ember.get(this, 'flashMessages');
    flashMessages.warning(`File "${file.name}" Removed!`);
  },
  emojiSuccess(file) {
    const emoji = file.type === 'application/pdf' ? "😍" : "🙂";
    let message = `<span style="font-size: 3em;">${emoji}</span>`;
    $(file.previewTemplate).find('.dz-success-mark').html(message);
  }
});
