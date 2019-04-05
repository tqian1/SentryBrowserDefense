(function () {
  'use strict';

  class DashboardController {

    constructor(Auth) {
      this.Auth = Auth;
    }

  }

  angular.module('angularAdminFullstackApp.pages.dashboard')
    .controller('DashboardController', DashboardController);
})();
