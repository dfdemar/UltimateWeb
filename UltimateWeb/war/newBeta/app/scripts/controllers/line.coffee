'use strict'

angular.module('newBetaApp')
  .controller 'LineCtrl', ($scope, $q, playerStats, lineStats, Line) ->
    scope = $scope
    scope.dragging
    scope.selectedLine
    scope.lines = {}
    $scope.loading = true
    lsApi = null
    lineStats.then (response)->
      lsApi = response
      $scope.players = lsApi.getPlayers()
      $scope.loading = false
    scope.setDragging = (player)->
      scope.dragging = player
    scope.addLine = ->
      line = new Line
      scope.lines[line.id] = line
      scope.selectedLine = line
    scope.removeLine = (line)->
      delete scope.lines[line.id]
    scope.addLine()