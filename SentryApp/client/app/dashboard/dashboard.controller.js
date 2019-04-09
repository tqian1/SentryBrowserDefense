'use strict';

export default class DashboardController {

  /*@ngInject*/
  constructor($http, $scope, $q, FileUploader) {
    $scope.heapIds = []
    $scope.getHeaps = function() {
      $http.get('/api/heaps')
        .then(response => {
          $scope.heapIds = response.data;
        });
    }

    $scope.getHeaps()
  }
}
