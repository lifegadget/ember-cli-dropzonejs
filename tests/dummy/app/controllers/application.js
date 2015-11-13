import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const { computed, observer, $, run, on, typeOf, debug, isPresent } = Ember;  // jshint ignore:line
const { defineProperty, get, set, inject, isEmpty, merge } = Ember; // jshint ignore:line
const a = Ember.A; // jshint ignore:line

export default Ember.Controller.extend({
  items: [
    { id: 'basic', title: 'Basic' },
    { id: 'backend', title: 'Backend' },
    { id: 'ember-data', title: 'Ember Data' },
  ],
  selected: 'basic',

  _selected: observer('selected', function() {
    this.transitionToRoute('demo-' + this.get('selected'));
  }),

  actions: {
    onChange(options) {
      this.set('selected', get(options, 'added.id'));
    }
  }
});
