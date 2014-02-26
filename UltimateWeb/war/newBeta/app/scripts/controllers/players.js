/* global _ */

'use strict';

angular.module('newBetaApp')
  .controller('PlayersCtrl', function ($scope, playerStats, allGames, filter, relocate) {
    $scope.relocate = relocate;
    $scope.loading = true;
    var games, api;
    allGames.then(function(stuff){
      games = stuff;
    });
    $scope.sortBy = 'name';
    playerStats.then(function(statApi){
      api = statApi;
      $scope.loading = false;
      $scope.playerStats = statApi.getFrom(games);
      $scope.statTypes = statApi.statTypes;
      $scope.numberOfGames = Object.keys(games).length;
      $scope.included = filter.included;
      filter.include(games);
      $scope.$watchCollection('included', function(){
        $scope.playerStats = statApi.getFrom(filter.included);
        render(); // fucking digest loop.
      });
      render();
    });
    $scope.console = console;
    $scope.leaderMap = {
      goals: {
        category: 'Offense',
        stats: ['goals', 'assists','touches']
      },
      ds : {
        category: 'Defense',
        stats: ['ds','dPoints', 'pulls']
      },
      plusMinus: {
        category: 'Plus / Minus',
        stats: ['plusMinus', 'oPlusMinus','dPlusMinus']
      },
      pointsPlayed: {
        category: 'Playing Time',
        stats: ['oPoints','dPoints','timePlayedMinutes']
      }
    };
    function render() {
      $scope.leaders = api.getLeaders($scope.playerStats, ['goals','ds','pointsPlayed', 'plusMinus']);
    }
  });
