'use strict'

angular.module('newBetaApp')
  .factory 'lineStats', ($q, allGames, team) ->
    deferred = $q.defer()
    $q.all([allGames, team]).then (response)->
      allGames = response[0]
      team = response[1]
      deferred.resolve api

    getStats = _.memoize (players)->
      result = {}
      # get considered points
      consideredPoints = []
      _(allGames).each (game)->
        _(game.points).each (point)->
          if _(point.line).intersection(players).length is players.length 
            #if the line contains all of the passed players
            consideredPoints.push point
      result.consideredPoints = consideredPoints
      result
    api =
      getPlayers: ->
        _(team.players).pluck 'name'
      getStats: getStats


    return deferred.promise