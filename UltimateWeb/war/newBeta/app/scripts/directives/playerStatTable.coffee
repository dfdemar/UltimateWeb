'use strict'

angular.module('newBetaApp')
  .directive 'playerStatTable', ($routeParams, playerStats, filter) ->
    templateUrl: 'includes/partials/playerStatTable.html'
    restrict: 'E'
    scope: 
      playerName: '='
    link: (scope, element, attrs) ->
      scope.included = filter.included
      scope.$watch 'included', ->
        scope.myStats = playerStats.getAll?()[scope.playerName]
        scope.teamAverage = playerStats.getAverages?()

      playerStats.then (response)->
        playerStats = response
        init()

      init = ->
        scope.playerStats = playerStats.getAll()[scope.playerName].stats
        scope.teamAverage = playerStats.getAverages()
        scope.statTypes = _.keys(scope.playerStats).sort()


