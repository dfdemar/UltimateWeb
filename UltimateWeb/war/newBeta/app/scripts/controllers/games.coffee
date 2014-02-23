'use strict'

angular.module('newBetaApp')
  .controller 'GamesCtrl', ($scope, $q, allGames, teamStats, playerStats, gameStats) ->
    # stupid coffee...
    games = null
    gsApi = null
    psApi = null
    # I hate writing $'s'
    scope = $scope

    # loading
    scope.loading = true
    $q.all([allGames, playerStats, gameStats]).then (responses)->
      games = responses[0]
      psApi = responses[1]
      gsApi = responses[2]
      scope.select _(games).max (game) ->
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
      scope.gameStats = gsApi.getFor game
      scope.gameLoading = false

    # points control
    openPoints = {}
    scope.togglePoints = (points, only) ->
      if only then openPoints = {}
      _(_(points).pluck '$$hashKey').each (id) ->
        openPoints[id] = !openPoints[id]
    scope.isOpen = (point) ->
      openPoints[point['$$hashKey']]