(function () {
  'use strict';

  /** @ngInject */
  function routeConfig($urlRouterProvider, baSidebarServiceProvider) {
    $urlRouterProvider.when('/', '/dashboard');
    $urlRouterProvider.otherwise('/dashboard');

    baSidebarServiceProvider.addStaticItem({
      title: 'Login',
      icon: 'fa fa-sign-in',
      stateRef: 'account.login',
      authenticate: false
    });
  }

  angular.module('angularAdminFullstackApp.pages', [
    'ui.router',
    'angularAdminFullstackApp.pages.dashboard',
    'angularAdminFullstackApp.pages.admin',
    'angularAdminFullstackApp.pages.account'
  ]).config(routeConfig);

})();
