/*jshint node:true*/
module.exports = {
  description: 'Installs the underlying dropzonejs using Bower',
  normalizeEntityName: function() {},
  afterInstall: function() {
    return this.addBowerPackagesToProject([
      {name: 'dropzone', target: '^4.2.0'}
    ]);
  }

  // locals: function(options) {
  //   // Return custom template variables here.
  //   return {
  //     foo: options.entity.options.foo
  //   };
  // }
};
