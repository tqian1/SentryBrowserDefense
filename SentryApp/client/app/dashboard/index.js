'use strict';

import angular from 'angular';
import routes from './dashboard.routes';
import DashboardController from './dashboard.controller';

export default angular.module('sentryAppApp.dashboard', ['sentryAppApp.auth', 'ui.router'])
  .config(routes)
  .controller('DashboardController', DashboardController)
  .name;
