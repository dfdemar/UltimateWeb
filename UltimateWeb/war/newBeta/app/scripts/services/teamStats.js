'use strict';

angular.module('newBetaApp')
  .factory('teamStats', function($q, $routeParams, api, allGames) {
    var deferred = $q.defer();
    var statsMap = {};
    allGames.then(function(games){
      api.retrieveTeamStatsForGames($routeParams.teamId, _.pluck(games,'gameId'),
        function success(result) {
          deferred.resolve(result);
        },
        function failure(e) {
          deferred.reject(e);
        }
      );
    });
    return deferred.promise;
  });
