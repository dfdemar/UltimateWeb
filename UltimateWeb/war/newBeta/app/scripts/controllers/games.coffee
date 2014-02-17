'use strict'

angular.module('newBetaApp')
  .controller 'GamesCtrl', ($scope, $q, allGames, teamStats, playerStats) ->
    $scope.loading = true
    $q.all([allGames, teamStats, playerStats])
      .then ->
        $scope.loading = false