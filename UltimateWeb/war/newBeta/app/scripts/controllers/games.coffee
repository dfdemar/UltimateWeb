'use strict'

angular.module('newBetaApp')
  .controller 'GamesCtrl', ($scope, $q, $location, allGames, playerStats, gameStats, filter, relocate) ->
    # stupid coffee...
    games = null
    gsApi = null
    fApi = null
    # I hate writing $'s'
    scope = $scope
    scope.relocate = relocate
    scope.console = console
    # loading
    scope.loading = true
    $q.all([allGames, playerStats, gameStats, filter]).then (responses)->
      games = responses[0]
      gsApi = responses[2]
      fApi = responses[3]
      try 
        id = _($location.search()).keys()[0]
        if games[id] then scope.select games[id]
        else scope.select _(games).max (game) -> game.msSinceEpoch
      catch
        scope.select _(games).max (game) -> game.msSinceEpoch
      scope.loading = false

    # display all games with selection capabilities
    allGames.then (games) ->
      scope.games = games
      scope.sortedGames = _(games).toArray()

    scope.isSelectedGame = (game) ->
      game == scope.selectedGame

    scope.select = (game) ->
      scope.gameLoading = true
      $location.search(game.gameId)
      scope.selectedGame = game
      scope.gameStats = gsApi.getFor game
      fApi.onlyInclude([game])
      scope.gameLoading = false

    # points control
    openPoints = {}
    scope.togglePoints = (points, only) ->
      if only then openPoints = {}
      _(_(points).pluck '$$hashKey').each (id) ->
        openPoints[id] = !openPoints[id]
    scope.isOpen = (point) ->
      openPoints[point['$$hashKey']]