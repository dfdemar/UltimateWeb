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
      getStats: =>
        console.log 'todo'
