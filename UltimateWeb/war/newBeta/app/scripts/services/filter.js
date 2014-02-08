/* global _ */

'use strict';

angular.module('newBetaApp')
  .factory('filter', function (allGames) {
    var includedGames = [];
    function exclude(game){
      var index = includedGames.indexOf(game);
      if (index > -1){
        includedGames.splice(index);
      }
    }
    allGames.then(function(games){
      _.each(games, function(game){
        includedGames.push(game);
      });
    });
    return {
      included: includedGames,
      include: function(games){
        if (games.gameId) {
          includedGames.push(games);
        }
        else {
          _.each(games, function(game){
            includedGames.push(game);
          });
        }
      },
      onlyInclude: function(games){
        includedGames.splice(0, includedGames.length);
        this.include(games);
      },
      exclude: function(games){
        if (_(games).isArray()){
          _.each(games, exclude);
        } else {
          exclude(games);
        }
      }
    };
  });
