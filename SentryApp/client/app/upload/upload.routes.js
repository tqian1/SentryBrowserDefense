'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('upload', {
    url: '/upload',
    template: require('./upload.html'),
    controller: 'UploadController',
    controllerAs: 'admin',
    // authenticate: 'user'
  });
}
