'use strict';

angular.module('iUtltimateApp')
  .service('Stathelpers', function Stathelpers() {
    var exports = {}
    exports.findGreatest = function(games, field){
      var winner = games[0];
      _.each(games, function(value){
        if (winner[field] < value[field] && value.playerName !== 'Anonymous'){
          winner = value;
        }
      });
      return winner;
    }
    return exports;
  });
