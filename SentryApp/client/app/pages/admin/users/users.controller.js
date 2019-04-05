'use strict';

(function() {

  class UsersController {
    constructor(User) {
      // Use the User $resource to fetch all users
      this.users = User.query();
    }

    delete(user) {
      user.$remove();
      this.users.splice(this.users.indexOf(user), 1);
    }
  }

  angular.module('angularAdminFullstackApp.pages.admin.users')
    .controller('UsersController', UsersController);
})();
