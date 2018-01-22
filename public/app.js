const app = angular.module('wedding-site-app', []);

app.controller('MainController', ['$http', function($http) {
  this.rsvpModal = false;
  this.numAttending = 0;
  this.numNotAttending = 0;

}])
