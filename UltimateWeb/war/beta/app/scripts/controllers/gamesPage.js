'use strict';

angular.module('iUtltimateApp')
  .controller('GamespageCtrl', function ($scope) {

    $scope.contentFocus = 'Stats';
    $scope.loadingGameRender = true;

    $scope.$watch('teamStats', function(){
      if ($scope.allGames && $scope.allGames[0].playerStats) {
        $scope.allGames.sort(function(a,b){
          return b.msSinceEpoch - a.msSinceEpoch;
        });
        renderGame($scope.allGames[0]);
        _.each($scope.allGames, function(game){
          deriveRecord(game);
          deriveLeaders(game);
        });
      }
    });

    $scope.derivePlayerFromName = function(name){
      var player;
      _.each($scope.playerStats, function(value){
        if (value.playerName === name){
          player = value;
        }
      });
      return player;
    };
    
    var teamSide = function(side){
      if ($scope.selectedPoint){
        var sameAsFirst = ($scope.selectedPoint.summary.score.ours + $scope.selectedPoint.summary.score.theirs) % 2;
        var leftAtFirst = ($scope.selectedGame.firstPointOline && !$scope.selectedGame.wind.leftToRight) || (!$scope.selectedGame.firstPointOline && $scope.selectedGame.wind.leftToRight);
        if ((sameAsFirst && leftAtFirst) || (!sameAsFirst && !leftAtFirst)){
          $scope.leftSide = 'US';
          $scope.rightSide = 'THEM';
        } else {
          $scope.rightSide = 'US';
          $scope.leftSide = 'THEM';
        }
      }
    };
    var openPoints = {};
    $scope.toggleOpen = function(start){
      openPoints[start] = !openPoints[start];
    };
    $scope.toggleAll = function(value){
      _.each($scope.selectedGame.points, function(point){
        openPoints[point.startSeconds] = value;
      });
    };
    $scope.selectPoint = function(point){
      $scope.selectedPoint = point;
    };
    $scope.isOpenPoint = function(start){
      if (openPoints[start]){
        return 'open';
      } else {
        return '';
      }
    };
    $scope.isContentFocus = function(value){
      return value === $scope.contentFocus ? 'active' : '';
    };
    $scope.changeContentFocus = function(value){
      $scope.contentFocus = value;
    };
    $scope.lookAt = function(game){
      $scope.loadingGameRender = true;
      document.body.style.cursor = 'wait';
      $('.select-game-button').css('cursor','wait');
      setTimeout(function(){$scope.$apply(renderGame(game))},500);
    };
    function renderGame(game){
      $scope.loadingGameRender = false;
      document.body.style.cursor = 'default';
      $('.select-game-button').css('cursor','default');
      $scope.selectedGame = game;
      $scope.consideredStats = game.playerStats;
    };
    $scope.isSelected = function(id){
      if ($scope.selectedGame){
        if (id === $scope.selectedGame.gameId){
          return 'active';
        } else {
          return '';
        }
      } else {
        return '';
      }
    }
    function deriveRecord(passedGame){
      if (!passedGame.gameSpecificStats) passedGame.gameSpecificStats = {};
      var wins = 0;
      var losses = 0;
      _.each($scope.allGames, function(game){
        if (game.opponentName.toLowerCase() === passedGame.opponentName.toLowerCase()){
          game.ours > game.theirs ? wins++ : losses++;
        }
      });
      passedGame.gameSpecificStats.record = wins + ' - ' + losses;
      console.log(passedGame.gameSpecificStats.record);
    }
    function deriveLeaders(passedGame){
      if (!passedGame.gameSpecificStats) passedGame.gameSpecificStats = {};
      passedGame.gameSpecificStats.leaders = {};
      passedGame.gameSpecificStats.leaders.goals = _.max(passedGame.playerStats, function(value){
        return value.goals;
      });
      passedGame.gameSpecificStats.leaders.assists = _.max(passedGame.playerStats, function(value){
        return value.assists;
      });
      passedGame.gameSpecificStats.leaders.ds = _.max(passedGame.playerStats, function(value){
        return value.ds;
      });
      passedGame.gameSpecificStats.leaders.turnovers = _.max(passedGame.playerStats, function(value){
        value.turnovers = value.drops + value.throwaways + value.stalls;
        return value.turnovers;
      });
      passedGame.gameSpecificStats.leaders.plusMinusCount = _.max(passedGame.playerStats, function(value){
        return value.plusMinusCount;
      });
    }
    $scope.getEventDescription = function(event) {
      switch (event.action) {
        case 'Catch':
          return {text: event.passer + ' to ' + event.receiver, image: 'big_smile.png'};
        case 'Drop' :
          return {text: event.receiver + ' dropped from ' + event.passer, image: 'eyes_droped.png'};
        case 'Throwaway':
          return {text: event.type == 'Offense' ? event.passer + ' throwaway' : 'Opponent throwaway', 
              image: event.type == 'Offense' ? 'shame.png' : 'exciting.png'};
        case 'Stall':
          return {text: event.passer + ' stalled', image: 'shame.png'};
        case 'MiscPenalty':
          return {text: event.passer + ' penalized (caused turnover)', image: 'shame.png'};     
        case 'D' :
          return {text: 'D by ' + event.defender, image: 'electric_shock.png'};
        case 'Pull' :
          return {text: 'Pull by ' + event.defender, image: 'nothing.png'};   
        case 'PullOb' :
          return {text: 'Pull (Out of Bounds) by ' + event.defender, image: 'what.png'};        
        case 'Goal':
          return {text: event.type == 'Offense' ? 
              'Our Goal (' + event.passer + ' to ' + event.receiver + ')' :
              'Their Goal', image: event.type == 'Offense' ? 'super_man.png' : 'cry.png'};    
        case 'Callahan':
          return {text: 'Our Callahan (' + event.defender + ')', image: 'victory.png'};   
        case 'EndOfFirstQuarter':
          return {text: 'End of 1st Quarter', image: 'stopwatch1.png'};   
        case 'EndOfThirdQuarter':
          return {text: 'End of 3rd Quarter', image: 'stopwatch1.png'};   
        case 'EndOfFourthQuarter':
          return {text: 'End of 4th Quarter', image: 'stopwatch1.png'}; 
        case 'EndOfOvertime':
          return {text: 'End of an Overtime', image: 'stopwatch1.png'};       
        case 'Halftime':
          return {text: 'Halftime', image: 'stopwatch1.png'};   
        case 'GameOver':
          return {text: 'Game Over', image: 'finishflag.png'};    
        case 'Timeout':
          return {text: 'Timeout', image: 'stopwatch1.png'};             
        default:
          return {text: event.action, image: 'hearts.png'};
      }
    }
    $scope.prettifyText = function(str){
      switch (str) {
        case 'plusMinusCount':
          return '+/- Count';
          break;
        case 'goals':
          return 'Goals';
          break;
        case 'assists':
          return 'Assists';
          break;
        case 'ds':
          return 'D\'s';
          break;
        case 'turnovers':
          return 'Turnovers';
          break;
      }
    }
  });
