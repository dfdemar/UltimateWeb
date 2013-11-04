'use strict';

angular.module('iUtltimateApp')
  .controller('TeampageCtrl', function ($scope) {
    $scope.ourBreakPercentageId = 'our-points-by-breaks-graph';
    $scope.theirBreakPercentageId = 'their-points-by-breaks-graph';

    $scope.$watch('teamStats', function(stats){
      if (stats){
        $scope.ourBreakPercentageData = [{label:"D-Line Points", value:stats.goalSummary.ourDlineGoals}, 
                    {label:"O-Line Points", value:stats.goalSummary.ourOlineGoals}];
        $scope.theirBreakPercentageData = [{label:"D-Line Points", value:stats.goalSummary.theirDlineGoals}, 
                    {label:"O-Line Points", value:stats.goalSummary.theirOlineGoals}];
      }
    }, true);
    $scope.$watch('allGames', function(newVal){
      if (newVal){
        if ($scope.allGames.length){
          var passesPerPossession = generalizeThrowsPerPossesion($scope.allGames);
          var passesPerScoredPossession = passesPerPossession.failed;
          var passesPerFailedPossession = passesPerPossession.successful;
          $scope.passesPerScoredPossessionData = [
            {label:"1", value:sumBetweenIndicies(passesPerScoredPossession, 1, 1)},
            {label:"2 - 4", value:sumBetweenIndicies(passesPerScoredPossession, 2, 4)},
            {label:"5 - 10", value:sumBetweenIndicies(passesPerScoredPossession, 5, 10)},
            {label:"11+", value:sumBetweenIndicies(passesPerScoredPossession, 11)}
          ];
          $scope.passesPerFailedPossessionData = [
            {label:"1", value:sumBetweenIndicies(passesPerFailedPossession, 1, 1)},
            {label:"2 - 4", value:sumBetweenIndicies(passesPerFailedPossession, 2, 4)},
            {label:"5 - 10", value:sumBetweenIndicies(passesPerFailedPossession, 5, 10)},
            {label:"11+", value:sumBetweenIndicies(passesPerFailedPossession, 11)}
          ];
        }
      }
    }, true);
    var sumBetweenIndicies = function(collection, min, max){
      max = max || collection.length;
      var sum = 0;
      for (var i = min; i <= max && i < collection.length; i++){
        if (collection[i]){
          sum += collection[i];
        }
      }
      return sum;
    }
    var generalizeThrowsPerPossesion = function(games){
      var failed = [];
      var successful = [];
      _.each(games, function(game){
        _.each(game.points, function(point){
          var scored = _.reduce(point.events, function(memo, event){
              if (event.type === 'Offense'){
                return memo + 1;
              } else {
                failed[memo] ? failed[memo]++ : failed[memo] = 1;
                return 0;
              }
            }, 0);
          successful[scored] ? successful[scored]++ : successful[scored] = 1;
        });
      });
      return {failed: failed, successful: successful};
    }

  });
