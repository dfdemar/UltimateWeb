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

    getConsideredPoints = (games, players)->
      consideredPoints = []

      _.each games, (game)->
        _.each game.points, (point)->
          if _.intersection(point.line, players).length is players.length
            #if the line contains all of the passed players
            consideredPoints.push point

      consideredPoints

    getScoringPercentage = (points)->
      ratio = _.countBy points, (point)->
        if point.events[point.events.length - 1].type is 'Offense' then 'scored' else 'failed'
      ratio.scored / (ratio.scored + ratio.failed) * 100

    getConnectionStats = (points, players)->

    getStats = (players)->
      consideredPoints = getConsideredPoints includedGames, players
      oPoints = _.filter consideredPoints, (point)-> point.summary.lineType is 'O'
      dPoints = _.filter consideredPoints, (point)-> point.summary.lineType is 'D'

      result =
        consideredPoints: consideredPoints
        oPoints: oPoints
        dPoints: dPoints
        scoringPercentage: getScoringPercentage consideredPoints
        onOffense:
          scoringPercentage: getScoringPercentage oPoints
        onDefense:
          scoringPercentage: getScoringPercentage dPoints

      result


    api =
      getPlayers: ->
        _.pluck team.players, 'name'
      getStats: getStats


    deferred.promise
]