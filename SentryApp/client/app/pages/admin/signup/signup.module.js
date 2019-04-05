(function () {
  'use strict';

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.signup', {
        parent: 'admin',
        url: '/signup',
        templateUrl: 'app/pages/admin/signup/signup.html',
        controller: 'SignupController',
        controllerAs: 'vm',
        title: 'Create',
        sidebarMeta: {
          order: 20
        },
        authenticate: true
      });
  }

  angular.module('angularAdminFullstackApp.pages.admin.signup', [])
    .config(routeConfig);
})();
