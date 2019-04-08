'use strict';

export default class DashboardController {

  /*@ngInject*/
  constructor($http, $scope, $q) {
    $scope.uploadFileToUrl = function (file, uploadUrl) {
        //FormData, object of key/value pair for form fields and values
        var fileFormData = new FormData();
        fileFormData.append('file', file);

        var deffered = $q.defer();
        $http.post(uploadUrl, fileFormData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}

        }).then(res => {
          this.features = res.data;
          console.log(this.features);
        }, err => {
          window.alert('Couldn\'t upload heap snapshot', err);
        });

        return deffered.promise;
    }

    $scope.uploadFile = function () {
        var file = $scope.myFile;
        var uploadUrl = "../api/upload",
            promise = $scope.uploadFileToUrl(file, uploadUrl);

        promise.then(function (response) {
            console.log("succeed")
        }, function () {
            console.log("fail")
        })
    };
  }
}
