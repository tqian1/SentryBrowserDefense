(function () {
  'use strict';

  function routeConfig($stateProvider) {
    $stateProvider
      .state('account.login', {
        parent: 'account',
        url: '/login',
        templateUrl: 'app/pages/account/login/login.html',
        controller: 'LoginController',
        controllerAs: 'vm',
        sidebarMeta: {
          order: 0
        }
      });
  }

  angular.module('angularAdminFullstackApp.pages.account.login', [])
    .config(routeConfig);
})();
