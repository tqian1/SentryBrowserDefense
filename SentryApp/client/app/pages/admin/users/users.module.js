(function () {
  'use strict';

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.users', {
        parent: 'admin',
        url: '/users',
        templateUrl: 'app/pages/admin/users/users.html',
        controller: 'UsersController',
        controllerAs: 'admin',
        title: 'Users',
        sidebarMeta: {
          order: 10
        }
      });
  }

  angular.module('angularAdminFullstackApp.pages.admin.users', [])
    .config(routeConfig);
})();
