'use strict'

angular.module('newBetaApp')
  .factory 'lineStats', ['$q', 'team', 'allGames', 'filter',($q, team, allGames, filter) ->

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
      _.each includedGames, (game)->
        _.each game.points, (point)->
          if _.intersection(point.line, players).length is players.length 
            #if the line contains all of the passed players
            consideredPoints.push point
      result.consideredPoints = consideredPoints
      result

    api =
      getPlayers: ->
        _.pluck team.players, 'name'
      getStats: getStats


    deferred.promise
]