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
      players = playerStats.getFrom() 
      scope.player = players[playerName]
      scope.loading = false
      playerExtensionStats.setPlayer playerName 
      playerExtensionStats.setGames allGames
      scope.targetStats = playerExtensionStats.getTargetMap()
