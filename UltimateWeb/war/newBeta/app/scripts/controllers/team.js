'use strict';

angular.module('newBetaApp')
  .controller('TeamCtrl', function($scope, teamStats, $location) {
    $scope.loading = true;
    teamStats.then(function(api) {
      $scope.teamStats = api.getFromIncluded();
      $scope.loading = false;
    });
  });