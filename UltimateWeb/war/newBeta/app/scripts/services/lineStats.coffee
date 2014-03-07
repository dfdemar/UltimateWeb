'use strict'

angular.module('newBetaApp')
  .factory 'lineStats', ($q, allGames, team) ->
    deferred = $q.defer()
    $q.all([allGames, team]).then (response)->
      allGames = response[0]
      team = response[1]
      deferred.resolve api

    api =
      getPlayers: ->
        _(team.players).pluck 'name'

    return deferred.promise