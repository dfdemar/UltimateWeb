'use strict';

angular.module('iUtltimateApp')
  .controller('DownloadpageCtrl', function($scope, Rest) {
    $scope.downloadUrl = Rest.urlForStatsExportFileDownload($scope.teamId, null);
  });