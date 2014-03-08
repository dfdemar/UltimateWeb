'use strict'

angular.module('newBetaApp')
  .controller 'LineCtrl', ($scope, lineStats, Line, filter) ->
    scope = $scope
    scope.dragging
    scope.selectedLine
    scope.lines = {}
    scope.includedGames = filter.included
    $scope.loading = true


    lineStats.then (response)->
      lineStats = response
      $scope.players = lineStats.getPlayers()
      $scope.loading = false
      
    scope.setDragging = (player)->
      scope.dragging = player
    scope.addLine = ->
      line = new Line
      scope.lines[line.id] = line
      scope.selectedLine = line
    scope.removeLine = (line)->
      delete scope.lines[line.id]
    scope.addPlayerToSelected = (player)->
      scope.selectedLine.addPlayer(player)
    scope.selectLine = (line)->
      scope.selectedLine = line
    scope.addLine()

    # update the lines on filter change
    scope.$watchCollection 'includedGames', (update, old)->
      if update and lineStats.getStats
        _(scope.lines).each (line)->
          line.updateStats()
