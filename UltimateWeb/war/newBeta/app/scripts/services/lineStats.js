// Generated by CoffeeScript 1.7.1
'use strict';
angular.module('newBetaApp').factory('lineStats', function($q, team, allGames, filter) {
  var api, deferred, getStats, includedGames;
  deferred = $q.defer();
  includedGames = null;
  $q.all([team, allGames]).then(function(response) {
    includedGames = filter.included;
    team = response[0];
    return deferred.resolve(api);
  });
  getStats = function(players) {
    var consideredPoints, result;
    result = {};
    consideredPoints = [];
    _.each(includedGames, function(game) {
      return _.each(game.points, function(point) {
        if (_.intersection(point.line, players).length === players.length) {
          return consideredPoints.push(point);
        }
      });
    });
    result.consideredPoints = consideredPoints;
    return result;
  };
  api = {
    getPlayers: function() {
      return _.pluck(team.players, 'name');
    },
    getStats: getStats
  };
  return deferred.promise;
});
