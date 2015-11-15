import DS from 'ember-data';
const {attr,hasMany,belongsTo} = DS; // jshint ignore:line

export default DS.Model.extend({
  filename: attr('string'),
  lastUpdated: attr('date'),
  uploadedAt: attr('data'),
  payload: attr('string')
});
