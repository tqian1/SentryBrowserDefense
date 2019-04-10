'use strict';

export default class DashboardController {

  /*@ngInject*/
  constructor($http, $scope, $q, FileUploader) {
    $scope.heapIds = []
    $scope.minRange = 1000
    $scope.maxRange = 10000
    $scope.selectedHeap = {
      nodeCount: 0
    };
    $scope.getHeaps = function() {
      $http.get('/api/heaps')
        .then(response => {
          $scope.heapIds = response.data;
        });
    }

    $scope.selectHeap = function(heap) {
      $scope.selectedHeap = heap;
      $scope.slider.maxValue = $scope.selectedHeap.nodeCount > $scope.maxRange ?  $scope.maxRange : $scope.selectedHeap.nodeCount;
      console.log($scope.selectedHeap)
    }

    $scope.deleteHeap = function(heap) {
      $http.delete('/api/heaps/' + heap._id)
        .then(response => {
          $scope.getHeaps();
          console.log(response.data);
        });
    }

    $scope.getNodes = function() {
      $http.get('/api/heaps/' + $scope.selectedHeap._id)
        .then(response => {
          console.log(response.data);
        });
    }

    $scope.slider = {
        minValue: 0,
        maxValue: 30,
    };

    // call getHeaps on init for initial load
    $scope.getHeaps()
  }
}
