'use strict';

angular.module('newBetaApp')
  .controller('PlayersCtrl', function ($scope, stats, allGames) {
    var games;
    allGames.then(function(stuff){
      games = stuff;
    });
    stats.then(function(statApi){
      console.log(statApi.playerStats.getFrom(games));
    });
  });
