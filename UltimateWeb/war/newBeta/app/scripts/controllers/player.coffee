'use strict'

angular.module('newBetaApp')
  .controller 'PlayerCtrl', ($scope, $routeParams, $q, playerStats, allGames) ->
    scope = $scope
    scope.loading = true
    players = null
    $q.all([playerStats, allGames]).then (responses)->
      playerStats = responses[0]
      allGames = responses[1]
      players = playerStats.getFrom allGames
      scope.player = players[decodeURI $routeParams.playerNameUri]
      scope.loading = false
