'use strict'

angular.module('newBetaApp')
  .factory 'Line', ($rootScope) ->
    class Line
      constructor: ->
        @id = String Math.random()
        @players = []
      addPlayer: (player)=>
        @players = _.union @players, [player]
        $rootScope.$digest()
      removePlayer: (player)->
        @players = _.without @players, player
      getStats: =>
        console.log 'todo'
