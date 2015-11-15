import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const { computed, observer, $, run, on, typeOf, debug, isPresent } = Ember;  // jshint ignore:line
const { defineProperty, get, set, inject, isEmpty, merge } = Ember; // jshint ignore:line
const a = Ember.A; // jshint ignore:line

export default Ember.Controller.extend({
  navigator: inject.service(),
  items: [
    { id: null, title: 'Intro', subHeading: 'quick overview' },
    { id: 'demo-basic', title: 'Basic', subHeading: 'example dropzone' },
    { id: 'demo-basic-plus', title: 'Basic++', subHeading: 'more examples' },
    { id: 'demo-backend', title: 'Backend', subHeading: 'watch server\'s response' },
    { id: 'demo-local-data', title: 'Local Data', subHeading: 'server-less operation' },
  ],
  selected: computed('navigator.primaryRoute', function() {
    const route = this.get('navigator.primaryRoute');
    return route ? route : null;
  }),

  _selected: observer('selected', function() {
    const selected = this.get('selected');
    this.transitionToRoute(selected ? selected : 'application');
  }),

  actions: {
    onChange(options) {
      this.set('selected', get(options, 'added.id'));
    }
  }
});
