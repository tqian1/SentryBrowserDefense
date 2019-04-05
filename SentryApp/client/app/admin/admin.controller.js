'use strict';

export default class AdminController {
  users: Object[];
  features: Object[];
  featureText = "";
  featureInfo = "";

  /*@ngInject*/
  constructor(User, $http) {
    // Use the User $resource to fetch all users
    this.users = User.query();
    this.$http = $http;
    this.getFeatures();
  }

  delete(user) {
    user.$remove();
    this.users.splice(this.users.indexOf(user), 1);
  }

  addFeature() {
    let data = {
      name: this.featureText,
      info: this.featureInfo,
    };
    this.$http.post('/api/things/', data)
    .then(res => {
        this.getFeatures();
        console.log("success");
      }, err => {
      window.alert(err);
    });
  }

  getFeatures() {
    this.$http.get('/api/things', {
    })
    .then(res => {
      this.features = res.data;
      console.log(this.features);
    }, err => {
      window.alert('Couldn\'t fetch orders', err);
    });
  }
}
