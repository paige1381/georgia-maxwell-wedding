const app = angular.module('wedding-site-app', []);

app.controller('MainController', ['$http', function($http) {
  this.rsvpModal = false;
  this.rsvp = null;
  this.numAttending = null;
  this.numNotAttending = null;
  this.arrAttending = [];
  this.arrNotAttending = [];
  this.rsvpFormData = {};
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

  this.processRSVPSignIn = () => {
    console.log('rsvp:', this.rsvp);
    $http({
      method: 'POST',
      url: this.url + 'rsvps',
      data: this.rsvpFormData
    }).then(response => {
      this.rsvp = response.data
      this.rsvpModal = false;
      this.rsvpFormData = {};
      console.log('rsvp:', this.rsvp);
    }).catch(error => {
      console.log('error:', error);
    })
  }

  this.formatRSVPFormData = (id) => {
    for (let i = 0; i < this.attendingFormData.length; i++) {
      let formData = {
        name: this.attendingFormData[i].name,
        entree: this.attendingFormData[i].entree,
        attending: true
      }
      this.processRSVPForm(id, formData);
    }
    for (let i = 0; i < this.notAttendingFormData.length; i++) {
      let formData = {
        name: this.notAttendingFormData[i].name,
        entree: "",
        attending: false
      }
      this.processRSVPForm(id, formData);
    }
  }

  this.processRSVPForm = (id, formData) => {
    $http({
      method: 'POST',
      url: this.url + 'rsvps/' + id + '/guests',
      data: formData
    }).then(response => {
      console.log('Record added:', response.data);
      this.getAttendingList();
      this.getNotAttendingList();
    }).catch(error => {
      console.log('error:', error);
    })
  }



















}])
