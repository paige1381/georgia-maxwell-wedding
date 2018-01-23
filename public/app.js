const app = angular.module('wedding-site-app', []);

app.controller('MainController', ['$http', function($http) {
  this.rsvpModal = false;
  this.numAttending = null;
  this.numNotAttending = null;
  this.arrAttending = [];
  this.arrNotAttending = [];

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

  // this.getRSVPList = () => {
  //   $http({
  //     method: 'GET',
  //     url: this.url + 'rsvps'
  //   }).then(response => {
  //     this.rsvps = response.data;
  //     console.log(this.rsvps);
  //   }).catch(error => {
  //     console.log('error:', error);
  //   });
  // }

  // this.getRSVPList();

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

}])
