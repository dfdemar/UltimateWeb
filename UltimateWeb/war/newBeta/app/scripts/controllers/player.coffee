'use strict'

angular.module('newBetaApp')
  .controller 'PlayerCtrl', ($scope, $routeParams, $q, playerStats, allGames, playerExtensionStats) ->
    scope = $scope
    scope.loading = true
    scope.console = console
    players = null
    scope.playerName = decodeURI $routeParams.playerNameUri
    $q.all([playerStats, allGames, playerExtensionStats]).then (responses)->
      playerStats = responses[0]
      allGames = responses[1]
      playerExtensionStats = responses[2]
      init()
      scope.loading = false

    init = ->
      playerStats.setGames allGames
      playerExtensionStats.setGames allGames
      playerExtensionStats.setPlayer scope.playerName
      scope.targetStats = playerExtensionStats.getTargetMap()
