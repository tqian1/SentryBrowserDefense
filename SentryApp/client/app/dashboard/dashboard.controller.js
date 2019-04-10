'use strict';

export default class DashboardController {

  /*@ngInject*/
  constructor($http, $scope, $q, FileUploader) {
    $scope.heapIds = []
    $scope.nodes = []
    $scope.types = {}
    $scope.minRange = 20
    $scope.maxRange = 20
    $scope.selectedHeap = {
      nodeCount: 0
    };
    $scope.slider = {
        minValue: 0,
        maxValue: 0,
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
      $scope.getNodes();
      console.log($scope.selectedHeap)
    }

    $scope.deleteHeap = function(heap) {
      $http.delete('/api/heaps/' + heap._id)
        .then(response => {
          $scope.getHeaps();
        });
    }

    $scope.nodesRange = function() {
      var nodes = $scope.nodes.slice($scope.slider.minValue, $scope.slider.maxValue);
      console.log(nodes);
      return nodes;
    }

    $scope.getNodes = function() {
      $http.get('/api/heaps/' + $scope.selectedHeap._id)
        .then(response => {
          $scope.nodes = response.data.nodes;
          $scope.types = response.data.types;
          console.log($scope.nodes)
          console.log($scope.types)
        });
    }

    // call getHeaps on init for initial load
    $scope.getHeaps()
  }
}
