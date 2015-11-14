import Ember from 'ember';
import TemplateMixinMixin from '../../../mixins/template-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | template mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  let TemplateMixinObject = Ember.Object.extend(TemplateMixinMixin);
  let subject = TemplateMixinObject.create();
  assert.ok(subject);
});
