'use strict'

angular.module('newBetaApp')
  .directive 'playerStatTable', ($routeParams, playerStats, filter) ->
    templateUrl: 'includes/partials/playerStatTable.html'
    restrict: 'E'
    scope: 
      playerName: '='
    link: (scope, element, attrs) ->
      playerStats.then (response)->
        init(response)

      scope.included = filter.included
      scope.$watch 'included', ->
        scope.myStats = playerStats.getAll?()[scope.playerName]
        scope.teamAverage = playerStats.getAverages?()


      init = (api)->
        scope.playerStats = api.getAll()[scope.playerName].stats
        scope.teamAverage = api.getAverages()
        scope.statTypes = _.keys(scope.playerStats).sort()


