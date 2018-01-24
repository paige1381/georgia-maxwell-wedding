const app = angular.module('wedding-site-app', []);

app.controller('MainController', ['$http', function($http) {
  this.numAttending = null;
  this.numNotAttending = null;
  this.arrAttending = [];
  this.arrNotAttending = [];
  this.attendingFormData = [];
  this.notAttendingFormData = [];

  this.url = 'http://localhost:3000/'

  this.numAttendingRows = () => {
    for (let i = 0; i < this.numAttending; i++) {
      this.arrAttending.push(i);
    }
  }

  this.numNotAttendingRows = () => {
    for (let i = 0; i < this.numNotAttending; i++) {
      this.arrNotAttending.push(i);
    }
  }

  this.getAttendingList = () => {
    $http({
      method: 'GET',
      url: this.url + 'guests/attending'
    }).then(response => {
      this.attendingRsvps = response.data;
      this.attendingCount = this.attendingRsvps.length;
    }).catch(error => {
      console.log('error:', error);
    });
  }

  this.getAttendingList();

  this.getNotAttendingList = () => {
    $http({
      method: 'GET',
      url: this.url + 'guests/notAttending'
    }).then(response => {
      this.notAttendingRsvps = response.data;
      this.notAttendingCount = this.notAttendingRsvps.length;
    }).catch(error => {
      console.log('error:', error);
    });
  }

  this.getNotAttendingList();

  this.processRSVPForm = () => {
    $http({
      method: 'POST',
      url: this.url + 
    })






    console.log('Attending data:', this.attendingFormData);
    console.log('Not attending data:', this.notAttendingFormData);
  }


}])
