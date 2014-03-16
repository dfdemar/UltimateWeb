/* global _ */

'use strict';

angular.module('newBetaApp')
  .factory('playerStats', function($q, allGames, team) {

    var includedGames;
    var playerStats;
    var basicStatTypes = ['catches', 'drops', 'throwaways', 'stalls', 'penalized', 'ds', 'iBPulls', 'oBPulls', 'goals', 'callahans', 'thrownCallahans', 'assists', 'passesDropped', 'completions', 'timePlayed', 'pullHangtime', 'gamesPlayed', 'dPoints', 'oPoints', 'oPlusMinus', 'dPlusMinus','hungPulls'];


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
        _.each(basicStatTypes, function(type){
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
        extendPercentageStats(player.stats)
      });
      _.each(players, function(player, name){
        player.name = name;
      });
      _.each(players, function(player){
        extendAestheticStats(player.stats);
      });
      playerStats = players;
      return players;
    };
    function extendAestheticStats(stats){
      stats.pointsPlayed = stats.oPoints + stats.dPoints;
      stats.pulls = stats.oBPulls + stats.iBPulls;
      stats.touches = (stats.pickustats || 0) + stats.catches;
      stats.plusMinus = stats.oPlusMinus + stats.dPlusMinus;
      stats.timePlayedMinutes = Math.round(stats.timePlayed / 60);
      stats.averagePullHangtime = stats.hungPulls ? (stats.pullHangtime  / stats.hungPulls) : 0;
      _.each(['goals', 'assists', 'ds',  'throwaways',  'drostats'], function(name){
        stats['pp' + name[0].toUpperCase() + name.slice(1)] = stats.pointsPlayed ? (stats[name] / stats.pointsPlayed) : 0;
      });

    }
    function extendPercentageStats(stats){
      _.each([
          ['catchingPercentage', 'catches', 'drops'],
          ['passingPercentage', 'completions', 'throwaways'],
          ['iBPullingPercentage', 'iBPulls', 'oBPulls']
        ], function(average){
          stats[average[0]] = Math.round(stats[average[1]] / (stats[average[1]] + stats[average[2]]) * 100);
        }
      );
    }
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
      var totals = {};
      _.each(basicStatTypes, function(type){
        totals[type] = _(playerStats).reduce(getSumFunction(type));
      });
      extendPercentageStats(totals);
      extendAestheticStats(totals);
      return totals;
    }
    function getAverages(){
      var averages = {};
      var statTypes = _.keys(_(playerStats).sample().stats);
      _(statTypes).each(function(type){
        averages[type] = _(playerStats).reduce(getSumFunction(type)).valueOf() / _.keys(playerStats).length;
      });
      return averages;
    }
    function getSumFunction(type){
      return function(memo, player){
        if (_.isNumber(memo)) {
          return player.stats[type] ? memo + player.stats[type] : memo;
        } else {
          return player.stats[type];
        }
      };
    }
    function resolve(){
      deferred.resolve({
        getLeaders: getLeaders,
        getTotals: getTotals,
        getAverages: getAverages,
        getAll: function(){return playerStats},
        getForPlayer: function(playerName){
          return playerStats[playerName];
        },
        setGames: function(games){
          includedGames = games;
          derive();
        }
      });
    }
    return deferred.promise;
  });

// Assists Passes  Throwaways  Stalls  Percent Completed
// Goals Catches Touches Drops Percent Caught
// Games Played  PointsPlayed  Minutes Played  Offensive Points  Defensive Points
// D's Callahans Pulls Average Hang Time Out of Bounds Pulls
// Goals Assists Ds  Throwaways  Drops

