'use strict'

angular.module('newBetaApp')
  .directive 'playerStatTable', ($routeParams, playerStats, filter) ->
    templateUrl: 'includes/partials/playerStatTable.html'
    restrict: 'E'
    scope: 
      playerName: '='
    link: (scope, element, attrs) ->
      api = null
      playerStats.then (response)->
        api = response
        init()

      scope.included = filter.included
      scope.$watchCollection 'included', ->
        api?.setGames filter.included
        scope.playerStats = api?.getAll()[scope.playerName].stats
        scope.teamAverage = api?.getAverages()


      init = ()->
        api.setGames scope.included
        scope.playerStats = api.getAll()[scope.playerName].stats
        scope.teamAverage = api.getAverages()
        scope.statTypes = _.keys(scope.playerStats).sort()


