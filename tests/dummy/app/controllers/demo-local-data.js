import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const { computed, observer, $, run, on, typeOf, debug, isPresent } = Ember;  // jshint ignore:line
const { defineProperty, get, set, inject, isEmpty, merge } = Ember; // jshint ignore:line
const a = Ember.A; // jshint ignore:line
import moment from 'moment';

import xhrIntercept from '../mixins/xhr-intercept';

export default Ember.Controller.extend(xhrIntercept, {
  flashMessages: inject.service(),
  addedFile(file) {
    console.log('added: ', file,this);
    const flashMessages = Ember.get(this, 'flashMessages');
    const lastUpdated = moment(file.lastModified).format('ddd MMM Do YYYY');
    flashMessages.info(`File "${file.name}" Uploaded. Last updated ${lastUpdated}.` );
  },
  removedFile(file) {
    console.log('removed: ',file,this);
    const flashMessages = Ember.get(this, 'flashMessages');
    flashMessages.warning(`File "${file.name}" Removed!`);
  },
  complete(file) {
    console.log('completed: %o', file);
  },
  success(file, done) {
    console.log('success: ', file);
    done();
  },
  failure(file, done) {
    console.error(file);
    done(`failure to accept ${file.name}`);
  }

});
