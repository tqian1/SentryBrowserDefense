'use strict';

angular.module('angularAdminFullstackApp.auth', ['angularAdminFullstackApp.constants', 'angularAdminFullstackApp.util', 'ngCookies',
    'ui.router'
  ])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
