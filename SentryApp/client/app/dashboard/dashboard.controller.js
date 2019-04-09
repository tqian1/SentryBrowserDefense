'use strict';

export default class DashboardController {

  /*@ngInject*/
  constructor($http, $scope, $q, FileUploader) {
    var uploader = $scope.uploader = new FileUploader({
            url: '../api/heaps/upload',
        });
  }
}
