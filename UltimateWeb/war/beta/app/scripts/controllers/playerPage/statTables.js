'use strict';

angular.module('iUtltimateApp')
  .controller('StattablesCtrl', function ($scope) {
    $scope.statFocus = 'passing';
    $scope.focus = function(value){
      $scope.statFocus = value;
    }
    $scope.passingStats = ['playerName', 'assists', 'passes', 'throwaways', 'stalls', 'passSuccess'];
    $scope.receivingStats = ['playerName', 'goals', 'catches', 'touches', 'drops', 'catchSuccess'];
    $scope.pTStats = ['playerName', 'gamesPlayed', 'pointsPlayed', 'secondsPlayed', 'opointsPlayed', 'dpointsPlayed'];
    $scope.defenseStats = ['playerName', 'ds', 'callahans', 'pulls', 'pullsAvgHangtimeMillis', 'pullsOB'];
    $scope.perPointStats = ['playerName', 'goalsPP', 'assistsPP', 'dsPP', 'throwawaysPP', 'dropsPP'];
  });