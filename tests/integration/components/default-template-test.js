import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('default-template', 'Integration | Component | default template', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{default-template}}`);

  assert.equal(this.$().text().trim(), 'NO TEMPLATE FOUND, ENSURE YOUR preview TEMPLATE IS OF THE BLOCK FORM');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#default-template}}
      template block text
    {{/default-template}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
