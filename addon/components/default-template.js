import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const { computed, observer, $, run, on, typeOf, debug, isPresent } = Ember;  // jshint ignore:line
const { defineProperty, get, set, inject, isEmpty, merge } = Ember; // jshint ignore:line
const a = Ember.A; // jshint ignore:line

import layout from '../templates/components/custom-template';

export default Ember.Component.extend({
  layout: layout,
  classNames: ['custom-template'],
  classNameBindings: ['type'],
  type: 'preview',
  register: null, // you must pass in yielded register
  zoneId: null, // set during registration

  _register: on('init', function() {
    run.schedule('afterRender', () => {
      const {type,register} = this.getProperties('type','register');
      const content = this.$()[0].innerHTML;
      if(typeOf(register) === 'function') {
        let zoneId = register(type, content);
        this.set('zoneId', zoneId);
      } else {
        debug(`The ${type} template failed to register with the dropzone, make sure you are including the "yield as |register|" in your drop-zone component.`);
      }
    });
  })
});
