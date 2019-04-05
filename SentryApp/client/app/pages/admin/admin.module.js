(function () {
  'use strict';

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin', {
        url: '/admin',
        template: '<div ui-view></div>',
        abstract: true,
        title: 'Admin',
        sidebarMeta: {
          icon: 'fa fa-lock',
          order: 20
        },
        authenticate: true
      });
  }

  angular.module('angularAdminFullstackApp.pages.admin', [
    'angularAdminFullstackApp.pages.admin.users',
    'angularAdminFullstackApp.pages.admin.signup',
    'angularAdminFullstackApp.pages.admin.server'
  ]).config(routeConfig);
})();
