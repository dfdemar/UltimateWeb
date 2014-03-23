'use strict';

angular.module('newBetaApp')
  .controller('TeamCtrl', ['$scope', 'teamStats', '$location',function($scope, teamStats, $location) {
    $scope.loading = true;
    teamStats.then(function(api) {
      $scope.teamStats = api.getFromIncluded();
      $scope.loading = false;
    });
  }]);