(function () {
  'use strict';

  function routeConfig($stateProvider) {
    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'app/pages/dashboard/dashboard.html',
        controller: 'DashboardController',
        controllerAs: 'ctr',
        title: 'Dashboard',
        sidebarMeta: {
          icon: 'fa fa-tachometer',
          order: 0
        },
        authenticate: true
      });
  }

  angular.module('angularAdminFullstackApp.pages.dashboard', [
  ]).config(routeConfig);
})();
