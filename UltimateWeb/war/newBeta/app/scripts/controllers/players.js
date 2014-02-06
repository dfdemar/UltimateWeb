'use strict';

angular.module('newBetaApp')
  .controller('PlayersCtrl', function ($scope, playerStats, allGames, filter) {
    $scope.loading = true;
    var games;
    allGames.then(function(stuff){
      games = stuff;
    });
    playerStats.then(function(statApi){
      $scope.loading = false;
      $scope.playerStats = statApi.getFrom(games);
      $scope.statTypes = statApi.statTypes;
      $scope.numberOfGames = Object.keys(games).length;
      filter.include(games);
    });
    $scope.console = console;
  });
