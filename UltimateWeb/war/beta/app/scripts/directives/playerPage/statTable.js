'use strict';

angular.module('iUtltimateApp')
  .directive('statTable', function ($route) {
    return {
      templateUrl: 'views/partials/statTable.html',
      restrict: 'AE',
      priority: 0,
      scope: {
        team: '=',
        stats: '=',
        callback: '='
      },
      link: function postLink(scope, element, attrs) {
        var last;
        var order = 1;
        var perPoints = ['goals', 'assists', 'ds', 'throwaways', 'drops'];
        var lastRoute = $route.current;
        scope.$on('$locationChangeSuccess', function(event) {
            $route.current = lastRoute;
        });
        scope.$watch('team', function(){
          if (scope.team){
            _.each(scope.team, function(player){
              _.each(perPoints, function(type){
                if (player.pointsPlayed){
                  player[type + 'PP'] = player[type] / player.pointsPlayed;
                } else {
                  player[type + 'PP'] = 0;
                }
              })
            })
          }
        })
        scope.total = function(type){
          if (type === 'playerName') return 'Total';
          var sum = _.reduce(scope.team, function(memo, value){
            if (!isNaN(value[type])){
              return memo + value[type];
            } else {
              return memo;
            }
          }, 0);
          if ((scope.team && scope.team.length) && (type === 'pullsAvgHangtimeMillis' || type === 'passSuccess' || type === 'catchSuccess' || type.indexOf('PP') > 0)){
            return sum / scope.team.length;
          }
          else if (type === 'gamesPlayed'){
            return _.max(scope.team, function(value){
              return value.gamesPlayed;
            }).gamesPlayed;
          } else {
            return sum;
          }
        }
        scope.average = function(type){
          if (type === 'playerName') return 'Average';
          var sum = _.reduce(scope.team, function(memo, value){
            if (!isNaN(value[type])){
              return memo + value[type];
            } else {
              return memo;
            }
          }, 0);
          if (scope.team && scope.team.length){
            return sum / scope.team.length;
          }
        }
        scope.sortBy = function(type){
          if (last === type){
            order *= -1;
          } else {
            last = type;
            order = 1;
          }
          scope.team.sort(function(a,b){
            if (a[type] < b[type]) {
              return order;
            } else if (a[type] > b[type]){
              return order * -1;
            } else {
              return 0;
            }
          });
        }
        scope.numFormat = function(num){
          if (!isNaN(num)){
            var numStr = num.toLocaleString();
            if (numStr.indexOf('.') >= 0){
              numStr = numStr.slice(0, numStr.indexOf('.') + 3);
            }
            return numStr;
          } else {
            return num;
          }

        }
        scope.prettify = function(title){
          switch (title){
            case 'playerName':
              return 'Player Name';
              break;
            case 'passSuccess':
              return 'Percent Completed';
              break;
            case 'catchSuccess':
              return 'Percent Caught';
              break;
            case 'gamesPlayed':
              return 'Games Played';
              break;
            case 'secondsPlayed':
              return 'Minutes Played';
              break;
            case 'opointsPlayed':
              return 'Offensive Points';
              break;
            case 'dpointsPlayed':
              return 'Defensive Points';
              break;
            case 'relativeOPlusMinus':
              return "Offensive Relative +/-";
              break;
            case 'relativeDPlusMinus':
              return 'Defensive Relative +/-';
              break;
            case 'ds':
              return 'D\'s';
              break;
            case 'pullsAvgHangtimeMillis':
              return 'Average Hang Time';
              break;
            case 'pullsOB':
              return 'Out of Bounds Pulls';
              break;
            default :
              return title.charAt(0).toUpperCase() + title.replace('PP', '').slice(1);
          }
        }
      }
    };
  });