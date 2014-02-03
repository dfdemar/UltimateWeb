/* global _ */

'use strict';

angular.module('newBetaApp')
  .factory('stats', function($q, allGames) {
    function recordEvent(type, player1, player2) {
      switch (type) {
      case 'Catch':
        playerStats.catches++;
        break;
      case 'Drop':
        playerStats.drops++;
        break;
      case 'Throwaway':
        playerStats.throwaways++;
        break;
      case 'Stall':
        playerStats.stalls++;
        break;
      case 'MiscPenalty':
        playerStats.penalized++;
        break;
      case 'D':
        playerStats.ds++;
        break;
      case 'Pull':
        playerStats.pulls++;
        break;
      case 'PullOb':
        playerStats.oBPulls++;
        break;
      case 'Goal':
        playerStats.goals++;
        break;
      case 'Callahan':
        playerStats.callahans++;
        break;
      default:
        throw new Error(type, ' is not a registered event.');
      }
    }



    var deferred = $q.defer();
    allGames.then(function(games) {
      _.each(games, function(game) {
        game.points = JSON.parse(game.pointsJson);
        delete game.pointsJson;
      });

      deferred.resolve({
        playerStats: {
          include: function(gameRefs) {
            var players = {};
            _.each(gameRefs, function(ref) {
              _.each(games[ref.gameId].points, function(point) {
                _.each(point.line, function(playerName){
                  players[playerName] = players[playerName] || {};
                  players[playerName].stats = players[playerName].stats || {};
                  _.each(['catches', 'drops', 'throwaways', 'stalls', 'penalized', 'ds', 'pulls', 'oBPulls', 'goals', 'callahans', 'thrownCallahans', 'assists', 'passesDropped' 'throws'], function(name){
                    if (players[playerName].stats[name] === undefined) players[playerName].stats[name] = 0;
                  });
                });
              }); 
            });
          }
        },
        teamStats: {

        }
      });
    });
    return deferred.promise;



  });