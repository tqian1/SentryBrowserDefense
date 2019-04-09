'use strict';

import angular from 'angular';
import routes from './dashboard.routes';
import DashboardController from './dashboard.controller';

export default angular.module('sentryAppApp.dashboard', ['sentryAppApp.auth', 'ui.router'])
  .config(routes)
  .directive('fileModel', ['$parse', function ($parse) {
      return {
          restrict: 'A',
          link: function (scope, element, attrs) {
              var model = $parse(attrs.fileModel);
              var modelSetter = model.assign;

              element.bind('change', function () {
                  scope.$apply(function () {
                      modelSetter(scope, element[0].files[0]);
                  });
              });
          }
      };
  }])
  .controller('DashboardController', DashboardController)
  .name;
