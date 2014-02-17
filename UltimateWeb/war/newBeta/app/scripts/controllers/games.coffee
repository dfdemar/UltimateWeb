'use strict'

angular.module('newBetaApp')
  .controller 'GamesCtrl', ($scope, $q, allGames, teamStats, playerStats) ->
    # stupid coffee...
    global = {}
    # I hate writing $'s'
    scope = $scope

    # loading
    scope.loading = true
    $q.all([allGames, teamStats, playerStats])
      .then (things)->
        global.games = things[0]
        global.tsApi = things[1]
        global.psApi = things[2]
        scope.select _(global.games).max (game) ->
          game.msSinceEpoch
        scope.loading = false

    # display all games with selection capabilities
    allGames.then (games) ->
      scope.games = games
      scope.sortedGames = _(games).toArray()

    scope.isSelectedGame = (game) ->
      game == scope.selectedGame

    scope.select = (game) ->
      scope.gameLoading = true
      scope.selectedGame = game
      ps = global.psApi.getFrom([game])
      ts = global.tsApi.getFrom([game])
      scope.gameLoading = false
