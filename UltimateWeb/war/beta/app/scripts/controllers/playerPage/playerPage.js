'use strict';

angular.module('iUtltimateApp')
  .controller('PlayerpageCtrl', function ($scope, Rest) {
    $scope.loading = true;
    $scope.filterSize = "filter-thick";
    $scope.$watch('playerStats', function(){
      $scope.consideredStats = $scope.playerStats;
    })
});
