'use strict';

angular.module('iUtltimateApp')
  .directive('tournament', function () {
    return {
      templateUrl: 'views/partials/tournament.html',
      restrict: 'E',
      scope: {
        tournament: '='
      },
      link: function postLink(scope, element, attrs) {
        scope.getDate = function(millis){
          return new Date(millis);
        }
        scope.checkAll = function(bool){
          _.each(scope.tournament, function(value){
            value.isConsidered = bool;
          });
        }
        scope.toggle = function(game){
          game.isConsidered = !game.isConsidered;
        }
      }
    };
  });
