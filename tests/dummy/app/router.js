import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('basic');
  this.route('backend');
  this.route('ember-data');
});

export default Router;
