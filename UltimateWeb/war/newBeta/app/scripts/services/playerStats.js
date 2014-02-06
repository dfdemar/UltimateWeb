/* global _ */

'use strict';

angular.module('newBetaApp')
  .factory('playerStats', function($q, allGames, team) {
    function recordEvent(event, players) {
      switch (event.action) {
      case 'Catch':
        players[event.receiver] && players[event.receiver].stats.catches++;
        players[event.passer] && players[event.passer].stats.completions++;
        break;
      case 'Drop':
        players[event.receiver] && players[event.receiver].stats.drops++;
        players[event.passer] && players[event.passer].stats.passesDropped++;
        break;
      case 'Throwaway':
        players[event.passer] && players[event.passer].stats.throwaways++;
        break;
      case 'Stall':
        players[event.passer] && players[event.passer].stats.stalls++;
        break;
      case 'MiscPenalty':
        if (event.type === 'Offense'){
          players[event.passer] && players[event.passer].stats.penalized++;
        } else {
          players[event.defender] && players[event.defender].stats.penalized++;
        }
        break;
      case 'D':
        players[event.defender] && players[event.defender].stats.ds++;
        break;
      case 'Pull':
        if (players[event.defender]){
          players[event.defender].stats.iBPulls++;
          if (event.details && event.details.hangtime) {
            players[event.defender].stats.pullHangtime += (event.details.hangtime / 1000);
          }
        }
        break;
      case 'PullOb':
        if (players[event.defender]){
          players[event.defender].stats.oBPulls++;
        }
        break;
      case 'Goal':
        if (players[event.passer]){
          players[event.passer].stats.completions++;
          players[event.passer].stats.assists++;
        }
        if (players[event.receiver]){
          players[event.receiver].stats.catches++;
          players[event.receiver].stats.goals++;
        }
        break;
      case 'Callahan':
        if (players[event.defender]){
          players[event.defender].stats.catches++;
          players[event.defender].stats.goals++;
          players[event.defender].stats.ds++;
          players[event.defender].stats.callahans++;
        }
        break;
      default:
        if (['EndOfFirstQuarter', 'Halftime', 'EndOfThirdQuarter', 'EndOfFourthQuarter', 'GameOver'].indexOf(event.action) < 0){
          throw new Error(event.action, ' is not a registered event.');
        }
      }
    }


    var games, playerNames;
    var deferred = $q.defer();
    allGames.then(function(response) {
      games = response;
      if (games && team){
        resolve();
      }
    });
    team.then(function(response){
      playerNames = _(response.players).pluck('name');
      if (games && team){
        resolve();
      }
    });
    var derive = _.memoize(function(gameRefs) {
      var players = {};
      _.each(playerNames, function(name){
        players[name] = {};
        players[name].stats = {};
        _.each(['catches', 'drops', 'throwaways', 'stalls', 'penalized', 'ds', 'iBPulls', 'oBPulls', 'goals', 'callahans', 'thrownCallahans', 'assists', 'passesDropped', 'completions', 'timePlayed', 'pullHangtime', 'gamesPlayed', 'dPoints', 'oPoints'], function(type){
          players[name].stats[type] = 0;
        });
      });


      _.each(gameRefs, function(ref) {
        var playedInGame = {};
        _.each(games[ref.gameId].points, function(point) {
          _.each(point.line, function(name){
            if (players[name]) {
              if (!playedInGame[name]){
                players[name].stats.gamesPlayed++;
                playedInGame[name] = true;
              }
              point.summary.lineType === 'D' ? players[name].stats.dPoints++ : players[name].stats.oPoints++;
              players[name].stats.timePlayed += point.endSeconds - point.startSeconds;
            }
          });
          _.each(point.events, function(event){
            recordEvent(event, players);
          });
        });
      });
      _.each(players, function(player){
        _.each([
            ['catchingPercentage', 'catches', 'drops'],
            ['passingPercentage', 'completions', 'throwaways'],
            ['iBPullingPercentage', 'iBPulls', 'oBPulls']
          ], function(average){
            if (player.stats[average[1]] + player.stats[average[2]]){
              player.stats[average[0]] = Math.round(player.stats[average[1]] / (player.stats[average[1]] + player.stats[average[2]]) * 100);
            } else {
              player.stats[average[0]] = 100;
            }
          }
        );
      });
      return players;
    });

    function resolve(){
      _.each(games, function(game) {
        game.points = JSON.parse(game.pointsJson);
        delete game.pointsJson;
      });
      deferred.resolve({
        getFrom: derive,
      });
    }
    return deferred.promise;
  });

// Assists Passes  Throwaways  Stalls  Percent Completed
// Goals Catches Touches Drops Percent Caught
// Games Played  PointsPlayed  Minutes Played  Offensive Points  Defensive Points
// D's Callahans Pulls Average Hang Time Out of Bounds Pulls
// Goals Assists Ds  Throwaways  Drops

