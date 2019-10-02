import Ember from 'ember';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Component | drop zone', function(hooks) {
  setupTest(hooks);

  function stringGenerator(len){
      let text = " ";

      let charset = "abcdefghijklmnopqrstuvwxyz 0123456789";

      for( let i=0; i < len; i++ ){
        text += charset.charAt(Math.floor(Math.random() * charset.length));
      }
      return text;
  }

  test('it renders', function(assert) {
    assert.expect(2);

    // Creates the component instance
    let component = this.owner.factoryFor('component:drop-zone').create();
    assert.equal(component._state, 'preRender');

    // Renders the component to the page
    this.render();
    assert.equal(component._state, 'inDOM');
  });

  test('that is being initialized', function(assert) {
    let component = this.owner.factoryFor('component:drop-zone').create();
    this.render();
    Ember.run(() => {
      assert.ok(component.dropzone);
    });
  });

  test('Camelized API-styled options are being picked up', function(assert){
    let component = this.owner.factoryFor('component:drop-zone').create();

    component.set('dragStart', function() {});
    component.set('dragEnd', function() {});
    component.set('dragOver', function() {});
    component.set('dragLeave', function() {});

    component.set('maxFilesExceeded', function() {});
    component.set('processingMultiple', function() {});
    component.set('sendingMultiple', function() {});
    component.set('successMultiple', function() {});

    let options = component.getDropzoneOptions();

    assert.ok(options.dragstart);
    assert.ok(options.dragend);
    assert.ok(options.dragover);
    assert.ok(options.dragleave);

    assert.ok(options.maxfilesexceeded);
    assert.ok(options.processingmultiple);
    assert.ok(options.sendingmultiple);
    assert.ok(options.successmultiple);

  });

  test('that translations are being set', function(assert){
    let component = this.owner.factoryFor('component:drop-zone').create();

    component.set('dictDefaultMessage', stringGenerator(Math.floor(Math.random() * 100)));
    component.set('dictFallbackMessage', stringGenerator(Math.floor(Math.random() * 100)));
    component.set('dictFallbackText', stringGenerator(Math.floor(Math.random() * 100)));
    component.set('dictInvalidFileType', stringGenerator(Math.floor(Math.random() * 100)));
    component.set('dictFileTooBig', stringGenerator(Math.floor(Math.random() * 100)));
    component.set('dictResponseError', stringGenerator(Math.floor(Math.random() * 100)));
    component.set('dictCancelUpload', stringGenerator(Math.floor(Math.random() * 100)));
    component.set('dictCancelUploadConfirmation', stringGenerator(Math.floor(Math.random() * 100)));
    component.set('dictRemoveFile', stringGenerator(Math.floor(Math.random() * 100)));
    component.set('dictMaxFilesExceeded', stringGenerator(Math.floor(Math.random() * 100)));

    this.render();

    Ember.run(() => {
      let dropTranslations = component.dropzone.options;
      assert.equal(component.dictDefaultMessage, dropTranslations.dictDefaultMessage);
      assert.equal(component.dictFallbackMessage, dropTranslations.dictFallbackMessage);
      assert.equal(component.dictFallbackText, dropTranslations.dictFallbackText);
      assert.equal(component.dictInvalidFileType, dropTranslations.dictInvalidFileType);
      assert.equal(component.dictFileTooBig, dropTranslations.dictFileTooBig);
      assert.equal(component.dictResponseError, dropTranslations.dictResponseError);
      assert.equal(component.dictCancelUpload, dropTranslations.dictCancelUpload);
      assert.equal(component.dictCancelUploadConfirmation, dropTranslations.dictCancelUploadConfirmation);
      assert.equal(component.dictRemoveFile, dropTranslations.dictRemoveFile);
      assert.equal(component.dictMaxFilesExceeded, dropTranslations.dictMaxFilesExceeded);

    });
  });
});
