/* global _ */

'use strict';

angular.module('newBetaApp')
  .factory('playerStats', function($q, allGames, team) {

    var includedGames;
    var playerStats;


    function recordEvent(event, players) {
      switch (event.action) {
      case 'Catch':
        players[event.receiver] && players[event.receiver].stats.catches++;
        players[event.passer] && players[event.passer].stats.completions++;
        break;
      case 'Drop':
        players[event.receiver] && players[event.receiver].stats.drops++;
        players[event.receiver] && players[event.receiver].stats.oPlusMinus--;
        players[event.passer] && players[event.passer].stats.passesDropped++;
        break;
      case 'Throwaway':
        players[event.passer] && players[event.passer].stats.throwaways++;
        players[event.passer] && players[event.passer].stats.oPlusMinus--;
        break;
      case 'Stall':
        players[event.passer] && players[event.passer].stats.stalls++;
        players[event.passer] && players[event.passer].stats.oPlusMinus--;
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
        players[event.defender] && players[event.defender].stats.dPlusMinus++;
        break;
      case 'Pull':
        if (players[event.defender]){
          players[event.defender].stats.iBPulls++;
          if (event.details && event.details.hangtime) {
            players[event.defender].stats.hungPulls++;
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
          players[event.passer].stats.oPlusMinus++;
          players[event.passer].stats.completions++;
          players[event.passer].stats.assists++;
        }
        if (players[event.receiver]){
          players[event.receiver].stats.oPlusMinus++;
          players[event.receiver].stats.catches++;
          players[event.receiver].stats.goals++;
        }
        break;
      case 'Callahan':
        if (players[event.defender]){
          players[event.defender].stats.catches++;
          players[event.defender].stats.dPlusMinus++;
          players[event.defender].stats.oPlusMinus++;
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
    var derive = function() {
      var players = {};
      _.each(playerNames, function(name){
        players[name] = {};
        players[name].stats = {};
        _.each(['catches', 'drops', 'throwaways', 'stalls', 'penalized', 'ds', 'iBPulls', 'oBPulls', 'goals', 'callahans', 'thrownCallahans', 'assists', 'passesDropped', 'completions', 'timePlayed', 'pullHangtime', 'gamesPlayed', 'dPoints', 'oPoints', 'oPlusMinus', 'dPlusMinus','hungPulls'], function(type){
          players[name].stats[type] = 0;
        });
      });


      _.each(includedGames, function(ref) {
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
      _.each(players, function(player, name){
        player.name = name;
      });
      _.each(players, function(player){
        var ps = player.stats;
        ps.pointsPlayed = ps.oPoints + ps.dPoints;
        ps.pulls = ps.oBPulls + ps.iBPulls;
        ps.touches = (ps.pickups || 0) + ps.catches;
        ps.plusMinus = ps.oPlusMinus + ps.dPlusMinus;
        ps.timePlayedMinutes = Math.round(ps.timePlayed / 60);
        ps.averagePullHangtime = ps.hungPulls ? parseFloat((ps.pullHangtime  / ps.hungPulls).toFixed(2)) : 0;
        _.each(['goals', 'assists', 'ds',  'throwaways',  'drops'], function(name){
          ps['pp' + name[0].toUpperCase() + name.slice(1)] = ps.pointsPlayed ? parseFloat((ps[name] / ps.pointsPlayed).toFixed(2)) : 0;
        });
      });
      playerStats = players;
      return players;
    };
    function getLeaders(types){
      var leaders = {};
      _.each(types, function(type){
        leaders[type] = _(playerStats).max(function(player){
          return player.stats[type];
        });
      });
      return leaders;
    }
    function getTotals(){

    }
    function getAverages(){

    }
    function resolve(){
      deferred.resolve({
        getFrom: derive,
        getLeaders: getLeaders,
        getTotals: getTotals,
        getAverages: getAverages,
        setGames: function(games){includedGames = games;}
      });
    }
    return deferred.promise;
  });

// Assists Passes  Throwaways  Stalls  Percent Completed
// Goals Catches Touches Drops Percent Caught
// Games Played  PointsPlayed  Minutes Played  Offensive Points  Defensive Points
// D's Callahans Pulls Average Hang Time Out of Bounds Pulls
// Goals Assists Ds  Throwaways  Drops

