'use strict';

angular.module('iUtltimateApp')
  .controller('TeamCtrl', function ($scope, Rest) {
    $scope.tournaments = {};

    Rest.retrieveTeam($scope.teamId, true, function(data){
      $scope.players = data.players;
    });

    Rest.retrieveGames($scope.teamId, function(data){
      $scope.allGames = data;
      _.each($scope.allGames, function(game){
        game.isConsidered = true;
      });
      $scope.getPlayerStats($scope.getGameSpecificStats);
    });

    var responseCount = 0;
    var loadCount = 0;
    var checkLoad = function(callback){
      loadCount++;
      if (loadCount === $scope.allGames.length){
        $scope.derivePlayerStats();
        $scope.$apply($scope.basicStatsLoaded = true);
        callback();
      }
    };
    var onResponse = function(count){
      if(count === $scope.allGames.length * 2){
        $scope.filterStats();
        $scope.$apply($scope.allStatsLoaded = true);
      }
    };
    $scope.getGameSpecificStats = function(){
      _.each($scope.allGames, function(value){
        Rest.retrieveTeamStatsForGames($scope.teamId, [value.gameId], function(data){
          value.teamStats = data;
          onResponse(++responseCount);
        });
        Rest.retrieveGame($scope.teamId, value.gameId, function(data){
          value.points = JSON.parse(data.pointsJson);
          onResponse(++responseCount);
        });
      });

    };
    $scope.getPlayerStats = function(callback){
      var batches = [];
      for (var i = 0 ; i < $scope.allGames.length;){
        var batch = [];
        var j = i+4;
        while (i < j && i < $scope.allGames.length) {
          batch.push($scope.allGames[i]);
          i++;
        }
        batches.push(batch);
      }
      _.each(batches, function(games){
        var ids = _.reduce(games, function(memo, value){
          memo.push(value.gameId);
          return memo;
        }, []);
        Rest.retrievePlayerStatsForEachGame($scope.teamId, ids, function(response){
          _.each(response, function(data){
            _.each(games, function(game){
              if (game.gameId === data.gameId){
                game.playerStats = JSON.parse(data.playerStatsJson);
                checkLoad(callback);
              }
            });
          });
        }, function(error){
          throw new Error(error.toString());
        });
      });
    };

    $scope.mapTournaments = function(games){
      var map = {};
      _.each(games, function(value){
        map[value.tournamentName] ? map[value.tournamentName].push(value) : map[value.tournamentName] = [value];
      });
      return map;
    };

    $scope.derivePlayerStats = function(){
      var team = {};
      var playerStats = [];
      _.each($scope.allGames, function(game){
        if (game.isConsidered){
          _.each(game.playerStats, function(player){
            _.each(player, function(statVal, statType){
              team[player.playerName] = team[player.playerName] || {};
              if (statType === 'playerName'){
                team[player.playerName][statType] = statVal;
              } else if (statType === 'pullsAvgHangtimeMillis'){
                team[player.playerName].pullTime = team[player.playerName].pullTime || 0;
                team[player.playerName].pullTime += statVal * player.pulls;
              } else {
                team[player.playerName][statType] = team[player.playerName][statType] || 0;
                team[player.playerName][statType] += statVal;
              }
            });
          });
        }
      });
      _.each(team, function(player){
        player.catchSuccess = player.catches / (player.catches + player.drops) || 0;
        player.passSuccess = player.passes / (player.passes + player.throwaways) || 0;
        player.pullsAvgHangtimeMillis = player.pullTime / player.pulls || 0;
        playerStats.push(player);
      });
      $scope.playerStats = playerStats;
    };

    $scope.filterStats = function(){
      $scope.tournaments = $scope.mapTournaments($scope.allGames);
      var teamStats = {};
      var team = {};
      var consideredCount = 0;
      $scope.getPlayerStats();
      teamStats.teamRecord = _.reduce($scope.allGames, function(memo, value){
        if (value.isConsidered){
          consideredCount++;
          if (value.ours > value.theirs){
            memo.wins++;
          } else {
            memo.losses++;
          }
        }
        return memo;
      }, {wins: 0, losses: 0});
      teamStats.goalSummary = {};
      _.each($scope.allGames, function(game){
        if (game.isConsidered){
          teamStats.goalSummary.ourDlineGoals = teamStats.goalSummary.ourDlineGoals || 0;
          teamStats.goalSummary.ourOlineGoals = teamStats.goalSummary.ourOlineGoals || 0;
          teamStats.goalSummary.theirDlineGoals = teamStats.goalSummary.theirDlineGoals || 0;
          teamStats.goalSummary.theirOlineGoals = teamStats.goalSummary.theirOlineGoals || 0;
          teamStats.goalSummary.ourDlineGoals += game.teamStats.goalSummary.ourDlineGoals;
          teamStats.goalSummary.ourOlineGoals += game.teamStats.goalSummary.ourOlineGoals;
          teamStats.goalSummary.theirDlineGoals += game.teamStats.goalSummary.theirDlineGoals;
          teamStats.goalSummary.theirOlineGoals += game.teamStats.goalSummary.theirOlineGoals;
        }
      });
      teamStats.totalPoints = teamStats.goalSummary.ourDlineGoals + teamStats.goalSummary.ourOlineGoals;
      teamStats.totalTurnovers = _.reduce($scope.playerStats, function(memo, value){
        return memo += (value.throwaways + value.drops + value.stalls);
      }, 0);
      teamStats.conversionRate = teamStats.totalPoints / (teamStats.totalPoints + teamStats.totalTurnovers);
      $scope.mostRecentGame = _.reduce($scope.allGames, function(memo, value){
        if (memo){
          return (value.msSinceEpoch > memo.msSinceEpoch) ? value : memo;
        } else {
          return value;
        }
      });
      $scope.mostRecentTournament = $scope.mostRecentGame.tournamentName;
      $scope.flowMap = deriveAssistFlowChart();
      $scope.teamStats = teamStats;
    };
    var deriveAssistFlowChart = function(){
      var goalCount = 0;
      var assistMap = {
        nodes: {},
        links: {}
      };
      _.each($scope.allGames, function(game){
        if (game.isConsidered){
          _.each(game.points, function(point){
            var endEvent = point.events[point.events.length - 1];
            var penultimateEvent = point.events[point.events.length - 2];
            if (endEvent.type === 'Offense'){ // if the goal was scored by the offense.
              goalCount++;
              var passer = endEvent.passer + 'P';
              var receiver = endEvent.receiver + 'R';
              if (penultimateEvent && penultimateEvent.type === 'Offense'){
                var hPasser = penultimateEvent.passer + 'H';
                assistMap.nodes[hPasser] = true;
                addLink(hPasser, passer, assistMap);
              }
              assistMap.nodes[passer] = true;
              assistMap.nodes[receiver] = true;
              addLink(passer, receiver, assistMap);
            }
          });
        }
      });
      var nodes = [];
      var i = 0;
      var map = {};
      _.each(assistMap.nodes, function(value, key){
        map[key] = i;
        nodes[i] = {name: key};
        i++;
      });
      assistMap.nodes = nodes;
      var links = [];
      _.each(assistMap.links, function(receivers, thrower){
        _.each(receivers, function(quantity, receiver){
            links.push({source: map[thrower], target: map[receiver], value: quantity});
        });
      });
      assistMap.links = links;
      return assistMap;
    };
    var addLink = function(passer, receiver, map){
      if (map.links[passer]){
        if (map.links[passer][receiver]){
          map.links[passer][receiver] += 1;
        } else {
          map.links[passer][receiver] = 1;
        }
      } else {
        map.links[passer] = {};
        map.links[passer][receiver] = 1;
      }
    };
  });