'use strict'

angular.module('newBetaApp')
  .controller 'GamesCtrl', ($scope, $q, $location, allGames, playerStats, gameStats, filter, relocate) ->
    # I hate writing $'s'
    scope = $scope
    scope.relocate = relocate
    # loading
    scope.loading = true
    $q.all([allGames, playerStats, gameStats, filter]).then (responses)->
      allGames = responses[0]
      gameStats = responses[2]
      filter = responses[3]
      try 
        id = _($location.search()).keys()[0]
        if allGames[id] then scope.select allGames[id]
        else scope.select _(allGames).max (game) -> game.msSinceEpoch
      catch
        scope.select _(allGames).max (game) -> game.msSinceEpoch
      scope.loading = false
      scope.sortedGames = _(allGames).toArray()


    scope.isSelectedGame = (game) ->
      game == scope.selectedGame

    scope.select = (game) ->
      scope.gameLoading = true
      filter.onlyInclude([game])
      $location.search(game.gameId)
      scope.selectedGame = game
      scope.gameStats = gameStats.getFor game
      scope.gameLoading = false

    # points control
    openPoints = {}
    scope.togglePoints = (points, only) ->
      if only then openPoints = {}
      _(_(points).pluck '$$hashKey').each (id) ->
        openPoints[id] = !openPoints[id]
    scope.isOpen = (point) ->
      openPoints[point['$$hashKey']]