/* global _ */

'use strict';

angular.module('newBetaApp')
  .factory('filter', function () {
    var includedGames = [];
    function exclude(game){
      var index = includedGames.indexOf(game);
      if (index > -1){
        includedGames.splice(index);
      }
    }
    return {
      included: includedGames,
      include: function(games){
        includedGames.concat(games);
      },
      onlyInclude: function(games){
        includedGames.splice(0, includedGames.length);
        includedGames.concat(games);
      },
      exclude: function(games){
        if (_.isArray(games)){
          _.each(games, exclude);
        } else {
          exclude(games);
        }
      }
    };
  });
