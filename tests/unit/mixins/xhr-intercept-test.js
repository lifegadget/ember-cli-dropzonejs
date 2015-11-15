import Ember from 'ember';
import XhrInterceptMixin from '../../../mixins/xhr-intercept';
import { module, test } from 'qunit';

module('Unit | Mixin | xhr intercept');

// Replace this with your real tests.
test('it works', function(assert) {
  let XhrInterceptObject = Ember.Object.extend(XhrInterceptMixin);
  let subject = XhrInterceptObject.create();
  assert.ok(subject);
});
