/* global _ */

'use strict';

angular.module('newBetaApp')
  .factory('allGames', function($q, $routeParams, api) {
    var deferred = $q.defer();
    api.retrieveGamesData($routeParams.teamId,
      function success(response) {
        _.each(response, function(game) {
          game.date = new Date(game.msSinceEpoch);
          game.points = JSON.parse(game.pointsJson);
          delete game.pointsJson;
        });
        deferred.resolve(_(response).indexBy('gameId'));
      },
      function failure(e) {
        deferred.reject(e);
      }
    );
    return deferred.promise;
  });