'use strict';

export default class DashboardController {

  /*@ngInject*/
  constructor($http, $scope, $q, FileUploader) {
    $scope.myFile;

    $scope.uploader = new FileUploader({
      url: "../api/heaps/upload"
    });
  }
}
