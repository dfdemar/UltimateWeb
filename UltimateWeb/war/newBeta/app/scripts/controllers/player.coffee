'use strict'

angular.module('newBetaApp')
  .controller 'PlayerCtrl', ($scope, $routeParams, $q, playerStats, allGames, playerExtensionStats) ->
    scope = $scope
    scope.loading = true
    players = null
    playerName = decodeURI $routeParams.playerNameUri
    $q.all([playerStats, allGames, playerExtensionStats]).then (responses)->
      playerStats = responses[0]
      allGames = responses[1]
      playerExtensionStats = responses[2]

      playerStats.setGames allGames
      playerExtensionStats.setGames allGames
      playerExtensionStats.setPlayer playerName
      scope.player = playerStats.getForPlayer playerName
      scope.targetStats = playerExtensionStats.getTargetMap()

      scope.loading = false
