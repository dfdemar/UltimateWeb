'use strict';

angular.module('newBetaApp')
  .controller('PlayersCtrl', function ($scope, stats, allGames) {
    var foo;
    allGames.then(function(stuff){
      foo = stuff;
    });
    stats.then(function(statApi){
      statApi.playerStats.include(foo);
    });
  });
