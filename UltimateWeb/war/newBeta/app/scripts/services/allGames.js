'use strict';

angular.module('newBetaApp')
  .factory('allGames', function($q, $routeParams, api) {
    var deferred = $q.defer();
    api.retrieveGamesData($routeParams.teamId,
      function success(response) {
        var map = {};
        _.each(response, function(game){
          map[game.gameId] = game;
        });
        deferred.resolve(map);
      },
      function failure(e) {
        deferred.reject(e);
      }
    );
    return deferred.promise;
  });