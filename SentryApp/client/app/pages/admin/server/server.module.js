(function () {
  'use strict';

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.server', {
        parent: 'admin',
        url: '/server',
        templateUrl: 'app/pages/admin/server/server.html',
        controller: 'ServerController',
        controllerAs: 'ctr',
        title: 'Server',
        sidebarMeta: {
          icon: 'fa fa-server',
          order: 0
        },
        authenticate: true
      });
  }

  angular.module('angularAdminFullstackApp.pages.admin.server', [
  ]).config(routeConfig);
})();
