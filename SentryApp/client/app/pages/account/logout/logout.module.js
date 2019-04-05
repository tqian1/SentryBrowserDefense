(function () {
  'use strict';

  function routeConfig($stateProvider) {
    $stateProvider
      .state('account.logout', {
        parent: 'account',
        url: '/logout',
        template: '',
        controller: function($state, Auth) {
          let referrer = $state.params.referrer ||
              $state.current.referrer ||
              'account.login';
          Auth.logout();
          $state.go(referrer);
        },
        title: 'Logout',
        sidebarMeta: {
          order: 15
        },
        authenticate: true
      });
  }

  angular.module('angularAdminFullstackApp.pages.account.logout', [])
    .config(routeConfig);
})();
