'use strict';

angular.module('iUtltimateApp')
  .controller('GamespageCtrl', function ($scope) {

    $scope.$watch('teamStats', function(){
      if ($scope.allGames[0].playerStats) {
        $scope.allGames.sort(function(a,b){
          return b.msSinceEpoch - a.msSinceEpoch;
        });
        $scope.lookAt($scope.allGames[0]);
      }
    });

    $scope.stats = {
      leaders: {
        plusMinusCount: {},
        goals: {},
        assists: {},
        ds: {},
        turnovers: {}
      }
    };
    $scope.contentFocus = 'Stats';
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
    }
    var openPoints = {};
    $scope.toggleOpen = function(start){
      openPoints[start] = !openPoints[start];
    }
    $scope.toggleAll = function(value){
      _.each($scope.selectedGame.points, function(point){
        openPoints[point.startSeconds] = value;
      })
    }
    $scope.selectPoint = function(point){
      $scope.selectedPoint = point;
    }
    $scope.isOpenPoint = function(start){
      if (openPoints[start]){
        return 'open';
      } else {
        return '';
      }
    }
    $scope.isContentFocus = function(value){
      return value === $scope.contentFocus ? 'active' : '';
    }
    $scope.changeContentFocus = function(value){
      $scope.contentFocus = value;
    }
    $scope.lookAt = function(game){
      $scope.selectedGame = game;
      $scope.consideredStats = game.playerStats;
      deriveRecord();
      deriveLeaders();
    }
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
    function deriveRecord(){
      var wins = 0;
      var losses = 0;
      _.each($scope.allGames, function(game){
        if (game.opponentName === $scope.selectedGame.opponentName){
          game.ours > game.theirs ? wins++ : losses++;
        }
      });
      $scope.record = wins + ' - ' + losses;
    }
    function deriveLeaders(){
      $scope.stats.leaders.goals = _.max($scope.selectedGame.playerStats, function(value){
        return value.goals;
      });
      $scope.stats.leaders.assists = _.max($scope.selectedGame.playerStats, function(value){
        return value.assists;
      });
      $scope.stats.leaders.ds = _.max($scope.selectedGame.playerStats, function(value){
        return value.ds;
      });
      $scope.stats.leaders.turnovers = _.max($scope.selectedGame.playerStats, function(value){
        value.turnovers = value.drops + value.throwaways + value.stalls;
        return value.turnovers;
      });
      $scope.stats.leaders.plusMinusCount = _.max($scope.selectedGame.playerStats, function(value){
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
