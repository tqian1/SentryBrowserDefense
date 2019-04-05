class ServerController {
  // start-non-standard
  POLL_INTERVAL = 1000;
  // end-non-standard

  constructor($scope, $timeout, $http, baConfig) {
    this.$timeout = $timeout;
    this.$http = $http;
    this.$scope = $scope;
    this.loading = true;
    this.serverInfo = {};
    this.cpuLoadAverage = 0;
    this.osUpTimeDuration = '...';
    this.dbUpTimeDuration = '...';

    this.pollPromise = null;

    this.queryServerInfo();

    $scope.$on('$destroy', () => {
      if (this.pollPromise) {
        $timeout.cancel(this.pollPromise);
      }
    });
  }

  queryServerInfo() {
    this.$http.get('/api/server/info')
      .then(serverInfo => {
        this.serverInfo = serverInfo.data;
        this._calculateUpTimeDuration();
        this._calculateCpuLoadAverage();
        this.loading = false;
        console.log(this.serverInfo);
        this.pollPromise = this.$timeout(this.queryServerInfo.bind(this), this.POLL_INTERVAL);
      })
      .catch(error => {
        console.error(error);
      });
  }

  _calculateCpuLoadAverage() {
    let sum = 0;
    if (this.serverInfo.cpuLoad) {
      for (let i = 0; i < this.serverInfo.cpuLoad.length; i++) {
        sum += parseInt(this.serverInfo.cpuLoad[i], 10);
      }
      this.cpuLoadAverage = Math.round((sum / this.serverInfo.cpuLoad.length) * 100) / 100;
    }
  }

  _calculateUpTimeDuration() {
    this.osUpTimeDuration = moment.duration(parseInt(this.serverInfo.osUpTime, 10) * 1000).humanize();
    let dbStartTime = moment(parseInt(this.serverInfo.dbStartTime, 10));
    this.dbUpTimeDuration = moment(dbStartTime).fromNow();
  }
}

angular.module('angularAdminFullstackApp')
  .controller('ServerController', ServerController);
