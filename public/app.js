const app = angular.module('wedding-site-app', ['duScroll']).value('duScrollOffset', 66);

app.controller('MainController', ['$http', function($http) {
  this.rsvpLanding = true;
  this.rsvpForm = false;
  this.rsvpUpdate = false;
  this.rsvpModal = false;
  this.updateModal = false;
  this.rsvpList = false;
  this.user = {}
  this.rsvp = null;
  this.numAttending = null;
  this.numNotAttending = null;
  this.arrAttending = [];
  this.arrNotAttending = [];
  this.attendingFormData = [];
  this.notAttendingFormData = [];
  this.editAttending = [];
  this.editNotAttending = [];
  this.emailError = null;
  this.passwordError = null;
  this.deleteAttending = [];
  this.deleteNotAttending = [];
  this.collapse = false;
  this.slideOut = false;

  this.url = 'https://georgia-maxwell-wedding.herokuapp.com/'

  this.numAttendingRows = () => {
    this.arrAttending = [];
    for (let i = 0; i < this.numAttending; i++) {
      this.arrAttending.push(i);
    }
  }

  this.numNotAttendingRows = () => {
    this.arrNotAttending = [];
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

  this.processRSVPSignIn = (userPass) => {
    console.log(userPass);
    if (userPass.email.toLowerCase() === "paige1381@gmail.com") {
      userPass.username = "admin"
      console.log(userPass);
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
      console.log(response.data.user);
      this.user = response.data.user
      localStorage.setItem('token', JSON.stringify(response.data.token));
      this.createRSVP(userPass.email, this.user.id);
    }).catch(error => {
      console.log('error:', error);
      this.passwordError = "Email or password are incorrect"
      console.log(this.user);
    })
  }

  this.processUpdateSignIn = (userPass) => {
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
      localStorage.setItem('token', JSON.stringify(response.data.token));
      if (this.user) {
        this.validateEmail(userPass.email);
      }
    }).catch(error => {
      console.log('error:', error);
      this.passwordError = "Email or password are incorrect"
    })
  }

  this.signOut = () => {
    localStorage.clear('token');
    location.reload();
  }

  this.createRSVP = (email, id) => {
    $http({
      method: 'POST',
      url: this.url + 'rsvps',
      data: {
        email: email,
        user_id: id
      }
    }).then(response => {
      this.rsvp = response.data
      this.rsvpModal = false;
      this.rsvpLanding = false;
      this.rsvpForm = true;
    }).catch(error => {
      this.emailError = error.data.email[0]
      console.log('error:', error);
    })
  }

  this.deleteRSVP = (id) => {
    $http({
      method: 'DELETE',
      url: this.url + 'rsvps/' + id
    }).then(response => {
      this.rsvp = null;
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
  }

  this.processRSVPForm = (id, formData) => {
    $http({
      method: 'POST',
      url: this.url + 'rsvps/' + id + '/guests',
      data: formData
    }).then(response => {
      this.getAttendingList();
      this.getNotAttendingList();
      this.rsvpForm = false;
      this.rsvpLanding = true;
      this.signOut();
    }).catch(error => {
      console.log('error:', error);
    })
  }

  this.validateEmail = (email) => {
    $http({
      method: 'GET',
      url: this.url + 'rsvps'
    }).then(response => {
      this.rsvps = response.data;
      for (let i = 0; i < this.rsvps.length; i++) {
        if (this.rsvps[i].email.toLowerCase() === email.toLowerCase()) {
          this.rsvp = this.rsvps[i];
          this.getRSVPByEmail(email);
        }
        else {
          this.emailError = "Please enter a valid email"
        }
      }
    })
  }

  this.getRSVPByEmail = (email) => {
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
    this.updateModal = false;
    this.rsvpLanding = false;
    this.rsvpUpdate = true;
    if (this.user.username === 'admin') {
      this.rsvpList = true;
    }
    this.numAttending = this.editAttending.length;
    this.numNotAttending = this.editNotAttending.length;
    this.numAttendingRows()
    this.numNotAttendingRows()
  }

  this.formatRSVPUpdateData = () => {
    for (var i = 0; i < this.editAttending.length; i++) {
      if (this.editAttending[i].id) {
        this.updateRSVP(this.editAttending[i])
      }
    }
    for (var i = 0; i < this.editNotAttending.length; i++) {
      if (this.editNotAttending[i].id) {
        this.updateRSVP(this.editNotAttending[i])
      }
    }
  }

  this.updateRSVP = (rsvp) => {
    $http({
      method: 'PUT',
      url: this.url + 'guests/' + rsvp.id,
      data: rsvp
    }).then(response => {
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
      this.rsvp = null;
      this.signOut();
    }).catch(error => {
      console.log('error:', error);
    })
  }

  this.deleteGuestAttending = (index, guest) => {
    this.editAttending.splice(index, 1);
    this.numAttending --;
    this.arrAttending = [];
    this.numAttendingRows();
    this.deleteAttending.push(guest);
  }

  this.deleteGuestNotAttending = (index, guest) => {
    this.editNotAttending.splice(index, 1);
    this.numNotAttending --;
    this.arrNotAttending = [];
    this.numNotAttendingRows();
    this.deleteNotAttending.push(guest);
  }

  this.processDeleteGuests = () => {
    for (let i = 0; i < this.deleteAttending.length; i++) {
      if (this.deleteAttending[i].id) {
        this.deleteGuest(this.deleteAttending[i].id)
      }
    }
    for (let i = 0; i < this.deleteNotAttending.length; i++) {
      if (this.deleteNotAttending[i].id) {
        this.deleteGuest(this.deleteNotAttending[i].id)
      }
    }
  }

  this.deleteGuest = (id) => {
    $http({
      method: 'DELETE',
      url: this.url + 'guests/' + id
    }).then(response => {
      this.deleteAttending = [];
      this.deleteNotAttending = [];
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
      this.rsvp = null;
      this.signOut();
    }).catch(error => {
      console.log('error:', error);
    })
  }

  this.addGuestAttending = () => {
    this.numAttending ++;
    this.numAttendingRows();
  }

  this.addGuestNotAttending = () => {
    this.numNotAttending ++;
    this.numNotAttendingRows();
  }

  this.processAddedGuests = () => {
    for (let i = 0; i < this.editAttending.length; i++) {
      if (!this.editAttending[i].id) {
        let formData = {
          name: this.editAttending[i].name,
          entree: this.editAttending[i].entree,
          attending: true
        }
        this.addGuests(this.rsvp.id, formData);
      }
    }
    for (let i = 0; i < this.editNotAttending.length; i++) {
      if (!this.editNotAttending[i].id) {
        let formData = {
          name: this.editNotAttending[i].name,
          entree: "",
          attending: false
        }
        this.addGuests(this.rsvp.id, formData);
      }
    }
  }

  this.addGuests = (id, formData) => {
    $http({
      method: 'POST',
      url: this.url + 'rsvps/' + id + '/guests',
      data: formData
    }).then(response => {
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
      this.rsvp = null;
      this.signOut();
    }).catch(error => {
      console.log('error:', error);
    })
  }

}])
