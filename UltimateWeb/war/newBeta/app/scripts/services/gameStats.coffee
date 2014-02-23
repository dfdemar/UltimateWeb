'use strict'

angular.module('newBetaApp')
  .factory 'gameStats', ($q, allGames, playerStats) ->
    deferred = $q.defer()
    games = {}
    psApi = {}

    $q.all([allGames, playerStats]).then (response)->
      games = response[0]
      psApi = response[1]
      deferred.resolve api

    api = {}

    api.getFor = (game)->
      results = {}
      players = psApi.getFrom [game]

      # record
      relevant = _(games).where({opponentName: game.opponentName})
      unless _(relevant).isArray()
        relevant = [relevant]
      results.record = _(relevant).countBy (game)->
        if game.ours > game.theirs then 'wins' else 'losses'
      _(results.record).defaults
        wins: 0
        losses: 0

      # leaders
      leaders = {}
      _(['goals', 'assists', 'ds', 'throwaways', 'plusMinus']).each (type)->
        leaders[type] = _(players).max (player)->
          player.stats[type]
      results.leaders = leaders
      results        
    deferred.promise
