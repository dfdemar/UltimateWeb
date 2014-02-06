/* global _ */

'use strict';

angular.module('newBetaApp')
  .factory('filter', function () {
    var includedGames = [];
    function exclude(game){
      var index = includedGames.indexOf(game);
      if (index > -1){
        console.log('excluded', game);
        includedGames.splice(index);
      }
    }
    return {
      included: includedGames,
      include: function(games){
        if (games.gameId) includedGames.push(games);
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
