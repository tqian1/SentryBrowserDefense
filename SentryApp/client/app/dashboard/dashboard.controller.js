// Creation Date: April 3, 2019
// Original author: tqian1
// Contents: Majority of the dashboard view business logic

'use strict';

export default class DashboardController {

  /*@ngInject*/
  constructor($http, $scope, $q, FileUploader) {

    // start chart stuff
    $scope.labels;
    $scope.data;
    $scope.data2;
    $scope.onClick = function (points, evt) {
      console.log(points, evt);
    };
    $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
    $scope.options = {
      scales: {
        yAxes: [
          {
            id: 'y-axis-1',
            type: 'linear',
            display: true,
            position: 'left'
          }
        ]
      }
    };
    // end chart stuff

    // start heap stuff
    $scope.selectedHeap = {
      nodeCount: 0
    };
    $scope.heapIds = []
    $scope.nodes = []
    $scope.types = {}
    // end heap stuff

    // start slider stuff
    $scope.minRange = 20
    $scope.maxRange = 20
    $scope.slider = {
        minValue: 0,
        maxValue: 0,
    };
    $scope.nodesRange = function() {
      var nodes = $scope.nodes.slice($scope.slider.minValue, $scope.slider.maxValue);
      console.log(nodes);
      return nodes;
    }
    // end slider stuff

    $scope.getNodes = function() {
      $http.get('/api/heaps/' + $scope.selectedHeap._id)
        .then(response => {
          $scope.nodes = response.data.nodes;
          $scope.types = response.data.types;
          $scope.labels = Object.keys(response.data.types);
          $scope.data = [];
          $scope.data2 = [];
          for (var i in $scope.labels) {
            var typedata = response.data.types[$scope.labels[i]];
            $scope.data.push(typedata.count);
            $scope.data2.push(typedata.size);
          }
          console.log($scope.nodes)
          console.log($scope.types)
        });
    }

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

    // call getHeaps on init for initial load
    $scope.getHeaps()
  }
}
