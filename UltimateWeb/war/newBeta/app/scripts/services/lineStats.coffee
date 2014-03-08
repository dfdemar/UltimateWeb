'use strict'

angular.module('newBetaApp')
  .factory 'lineStats', ($q, team, allGames, filter) ->

    deferred = $q.defer()
    includedGames = null

    # wait for player names and games data.
    $q.all([team, allGames]).then (response)->
      includedGames = filter.included
      team = response[0]
      deferred.resolve api

    getStats = (players)->
      result = {}
      consideredPoints = []
      # get considered points
      _(includedGames).each (game)->
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