const app = angular.module('wedding-site-app', []);

app.controller('MainController', ['$http', function($http) {
  this.rsvpLanding = true;
  this.rsvpForm = false;
  this.rsvpUpdate = false;
  this.rsvpModal = false;
  this.updateModal = false;
  this.user = {}
  this.rsvp = null;
  this.numAttending = null;
  this.numNotAttending = null;
  this.arrAttending = [];
  this.arrNotAttending = [];
  this.rsvpFormData = {};
  this.attendingFormData = [];
  this.notAttendingFormData = [];
  this.editAttending = [];
  this.editNotAttending = [];

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
      url: this.url + 'guests/attending',
      headers: {
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      }
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

  this.processRSVPSignIn = (userPass) => {
    if (userPass.email.toLowerCase() === "paige1381@gmail.com") {
      userPass.username = "admin"
    }
    else {
      userPass.username = "guest"
    }
    $http({
      method: 'POST',
      url: this.url + 'users/login',
      data: {
        user: {
          username: userPass.username,
          password: userPass.password
        }
      }
    }).then(response => {
      this.user = response.data.user
      console.log('this.user:', this.user);
      localStorage.setItem('token', JSON.stringify(response.data.token));
      this.createRSVP(userPass.email, this.user.id);
    }).catch(error => {
      console.log('error:', error);
    })
  }

  this.signOut = () => {
    localStorage.clear('token');
    location.reload();
    console.log('this.user:', this.user);
  }

  this.createRSVP = (email, id) => {
    console.log('email:', email);
    $http({
      method: 'POST',
      url: this.url + 'rsvps',
      data: {
        email: email,
        user_id: id
      }
    }).then(response => {
      console.log('response.data:', response.data);
      this.rsvp = response.data
      this.rsvpModal = false;
      this.rsvpFormData = {};
      this.rsvpLanding = false;
      this.rsvpForm = true;
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
    this.numAttending = null;
    this.numNotAttending = null;
    this.arrAttending = [];
    this.arrNotAttending = [];
    this.attendingFormData = [];
    this.notAttendingFormData = [];
    this.rsvp = null;
    console.log('rsvp:', this.rsvp);
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
      this.rsvpForm = false;
      this.rsvpLanding = true;
    }).catch(error => {
      console.log('error:', error);
    })
  }

  this.getRSVPByEmail = (email) => {
    console.log('editAttending:', this.editAttending);
    console.log('editNotAttending:', this.editNotAttending);
    console.log('edit email:', email);
    for (let i = 0; i < this.attendingRsvps.length; i++) {
      if (this.attendingRsvps[i].rsvp.email.toLowerCase() === email.toLowerCase()) {
        this.editAttending.push(this.attendingRsvps[i])
      }
    }
    for (let i = 0; i < this.notAttendingRsvps.length; i++) {
      if (this.notAttendingRsvps[i].rsvp.email.toLowerCase() === email.toLowerCase()) {
        this.editNotAttending.push(this.notAttendingRsvps[i])
      }
    }
    console.log('records before edit:', this.editAttending);
    console.log('records before edit:', this.editNotAttending);
    this.updateModal = false;
    this.rsvpLanding = false;
    this.rsvpUpdate = true;
    this.numAttending = this.editAttending.length;
    this.numNotAttending = this.editNotAttending.length;
    this.numAttendingRows()
    this.numNotAttendingRows()
    this.rsvpFormData = {};
  }

  this.formatRSVPUpdateData = () => {
    console.log('records after edit:', this.editAttending);
    console.log('records after edit:', this.editNotAttending);
    for (var i = 0; i < this.editAttending.length; i++) {
      this.updateRSVP(this.editAttending[i])
    }
    for (var i = 0; i < this.editNotAttending.length; i++) {
      this.updateRSVP(this.editNotAttending[i])
    }
  }


  this.updateRSVP = (rsvp) => {
    console.log(rsvp);
    $http({
      method: 'PUT',
      url: this.url + 'guests/' + rsvp.id,
      data: rsvp
    }).then(response => {
      console.log('Record updated:', response.data);
      this.getAttendingList();
      this.getNotAttendingList();
      this.rsvpUpdate = false;
      this.rsvpLanding = true;
      this.editAttending = [];
      this.editNotAttending = [];
      this.numAttending = null;
      this.numNotAttending = null;
      this.arrAttending = [];
      this.arrNotAttending = [];
    }).catch(error => {
      console.log('error:', error);
    })
  }
















}])
