'use strict';

angular.module('iUtltimateApp')
  .controller('LeadersCtrl', function ($scope, Stathelpers) {
    $scope.pTLeader = {};
    $scope.oLeader = {};
    $scope.dLeader = {};
    $scope.pMLeader = {};
    $scope.$watch('playerStats', function(){
      if ($scope.playerStats !== undefined){
        $scope.pTLeader = Stathelpers.findGreatest($scope.playerStats, 'pointsPlayed');
        $scope.oLeader = Stathelpers.findGreatest($scope.playerStats, 'goals');
        $scope.dLeader = Stathelpers.findGreatest($scope.playerStats, 'ds');
        $scope.pMLeader = Stathelpers.findGreatest($scope.playerStats, 'plusMinusCount');
        $scope.pTLeader.minutesPlayed = Math.round($scope.pTLeader.secondsPlayed / 60);
      }
    })
  });