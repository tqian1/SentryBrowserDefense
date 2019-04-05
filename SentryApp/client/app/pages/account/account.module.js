(function () {
  'use strict';

  function routeConfig($stateProvider) {
    $stateProvider
      .state('account', {
        url: '/account',
        template: '<div ui-view></div>',
        abstract: true,
        title: 'Account',
        sidebarMeta: {
          icon: 'fa fa-user',
          order: 30
        },
        authenticate: true
      });
  }

  angular.module('angularAdminFullstackApp.pages.account', [
    'angularAdminFullstackApp.pages.account.login',
    'angularAdminFullstackApp.pages.account.logout',
    'angularAdminFullstackApp.pages.account.settings'
  ]).config(routeConfig);
})();
