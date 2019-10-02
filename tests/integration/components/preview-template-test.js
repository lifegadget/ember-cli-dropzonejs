import { find } from '@ember/test-helpers';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('preview-template', 'Integration | Component | preview template', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{preview-template}}`);

  assert.equal(find('*').textContent.trim(), 'NO TEMPLATE FOUND, ENSURE YOUR preview TEMPLATE IS OF THE BLOCK FORM');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#preview-template}}
      template block text
    {{/preview-template}}
  `);

  assert.equal(find('*').textContent.trim(), 'template block text');
});
