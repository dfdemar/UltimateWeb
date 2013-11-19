'use strict';

angular.module('iUtltimateApp')
  .controller('SpecificplayerpageCtrl', function ($scope, $routeParams, $location) {
    $scope.$watch('selectedPlayerName', function(){
      if ($scope.selectedPlayerName) {
        $scope.$watch('playerStats', function(){
          if ($scope.playerStats){
            _.each($scope.playerStats, function(player){
              if (player.playerName === $scope.selectedPlayerName){
                $scope.selectPlayer(player);
              }
            });
            !$scope.selectedPlayer && $location.url('/' + $scope.teamId + '/home');
          }
        });
      }
    });
    $scope.containsWord = function(input, target){
      return input.indexOf(target) > -1;
    };
    $scope.targetMapHeight = Math.min($scope.windowHeight, 1100)
    $scope.targetData;
    $scope.key = {
      handlerColors: ['#c75aba', '#C3CE00', '#0faa00'],
      cutterColors: ['#c5007c', '#949A27', '#298020'],
      dropColors: ['#c75aba', '#c5007c'],
      goalColors: ['#0faa00', '#298020'],
      catchColors: ['#C3CE00', '#949A27'],
      throwawayColor: '#ff9400'
    }
    $scope.hasPositions = _.reduce($scope.players, function(memo, player){
      return (memo || player.position === 'Handler');
    }, false);
    $scope.isInt = function(num){
      if (typeof(num) === 'string'){return true;}
      return num % 1 === 0;
    }
    $scope.fixNum = function(num, type){
      if (typeof(num) === 'string'){return num;}
      if (type === 'pullsAvgHangtimeMillis'){return (num / 1000).toFixed(2);}
      if (type === 'secondsPlayed'){return (num / 60).toFixed(2);}
      return num;
    }
    $scope.prettify = function(str){
      str = str.replace('PP', ' Per Point');
      switch (str){
        case 'dpointsPlayed':
          return 'D Points Played'
          break;
        case 'callahaneds':
          return 'Callahaned\'s'
          break;
        case 'catchSuccess':
          return 'Catch Success';
          break;
        case 'gamesPlayed':
          return 'Games Played';
          break;
        case 'miscPenalties':
          return 'Misc. Penalties';
          break;
        case 'opointsPlayed':
          return 'O Points Played';
          break;
        case 'passSuccess':
          return '% Passes Caught';
          break;
        case 'passerTurnovers':
          return 'Passer Turnovers';
          break;
        case 'secondsPlayed':
          return 'Minutes Played';
          break;
        case 'pullsAvgHangtimeMillis':
          return 'Avg. Pull Hangtime (secs)';
          break;
        case 'pullsOB':
          return 'OB Pulls';
          break;
        case 'pullsWithHangtime':
          return 'Pulls With Hangtime';
          break;
        case 'plusMinusCount':
          return '+/-';
          break;
        case 'plusMinusDLine':
          return 'D-Line +/-';
          break;
        case 'plusMinusOLine':
          return 'O-Line +/-';
          break;
        case 'pointsPlayed':
          return 'Points Played';
          break;
        default:
          return str.charAt(0).toUpperCase() + str.slice(1);
          break;

      }
    }
    $scope.$watch('selectedPlayer', function(){
      var consideredEvents = [];
      var targetMap = {};
      var targetData = [];
      $scope.targetData = undefined;
      if ($scope.playerStats && $scope.selectedPlayer){
        _.each($scope.allGames, function(game){
          if (game.isConsidered){
            _.each(game.points, function(point){
              _.each(point.line, function(playerName){
                if (playerName === $scope.selectedPlayer.playerName){
                  _.each(point.events, function(event){
                    if (event.type === 'Offense' && event.passer === $scope.selectedPlayer.playerName){
                      consideredEvents.push(event);
                    }
                  })
                }
              });
            });
          }
        });
        _.each(consideredEvents, function(event){
          targetMap[event.action] = targetMap[event.action] || {};
          targetMap[event.action][encodeURI(event.receiver)] = ++targetMap[event.action][encodeURI(event.receiver)] || 1;
        });
        _.each(targetMap, function(receivers, action){
          _.each(receivers, function(count, receiver){
            if (receiver === 'undefined') receiver = 'The Other Team';
            targetData.push({actionType: action, receiver: decodeURI(receiver), value: count});
          })
        });
        $scope.targetData = {children: targetData};
      }
    }, true);
  });
