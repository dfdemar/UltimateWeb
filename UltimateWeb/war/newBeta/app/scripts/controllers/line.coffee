'use strict'

angular.module('newBetaApp')
  .controller 'LineCtrl', ($scope, $q, playerStats, allGames) ->
    scope = $scope
    $scope.loading = true
    games = null
    psApi = null
    $q.all([playerStats, allGames]).then (response)->
      games = response[1]
      psApi = response[0]
      $scope.players = psApi.getFrom(games)
      $scope.loading = false


