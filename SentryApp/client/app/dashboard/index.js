'use strict';

import angular from 'angular';
import routes from './dashboard.routes';
import DashboardController from './dashboard.controller';

export default angular.module('sentryAppApp.dashboard', ['sentryAppApp.auth', 'ui.router'])
  .config(routes)
  .directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
  }])
  .controller('DashboardController', DashboardController)
  .name;
