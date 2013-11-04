'use strict';

angular.module('iUtltimateApp')
  .controller('FilterCtrl', function ($scope, Rest, $modal, $timeout) {
    $scope.popover = false;
    $scope.message = {'All Games': []};
    $scope.modalController = {};
    $scope.filterButtonLabel = 'All Games';
    _.each($scope.allGames, function(game, index){
      $scope.$watch('allGames[' + index + '].isConsidered', function(){
        if ($scope.allGames && $scope.allGames.length){
          var consideredCount = 0;
          var lastTournamentCount = 0;
          var lastTournament = $scope.allGames[0].tournamentName;
          _.each($scope.allGames, function(game){
            if (game.tournamentName === lastTournament){
              lastTournamentCount++;
            }
            if (game.isConsidered){
              consideredCount++;
              if (game.tournamentName !== lastTournament){
                lastTournament = false;
              }
            }
          });
          if (consideredCount === 1 && lastTournament){
            $scope.filterButtonLabel = 'Last Game';
          } else if (consideredCount === lastTournamentCount && lastTournament){
            $scope.filterButtonLabel = 'Last Tournament';
          } else if (consideredCount === $scope.allGames.length){
            $scope.filterButtonLabel = 'All Games';
          } else if (consideredCount === 0){
            $scope.filterButtonLabel = 'None';
          } else {
            $scope.filterButtonLabel = 'Custom';
          }
        }
      });
    })
    $scope.modalController.open = function(){
      $scope.popover = false;
      $scope.modal = $modal.open({
        templateUrl: 'views/filter/filter-modal.html',
        controller: 'FilterCtrl',
        scope: $scope,
        backdrop: true
      });
    }
    $scope.modalController.close = function(){
      $scope.filterStats();
      $scope.modal.close();
    }
    $scope.considerAll = function(){
      _.each($scope.allGames, function(value){
        value.isConsidered = true;
      });
      $scope.filterStats();
    }
    $scope.considerOnly = function(consideredGames){
      if (consideredGames.length){ // if the passed parameter is a tournament name.
        _.each($scope.allGames, function(game){
          if (game.tournamentName === consideredGames){
            game.isConsidered = true;
          } else {
            game.isConsidered = false;
          }
        });
      } else {
        _.each($scope.allGames, function(game){
            game.isConsidered = game.gameId === consideredGames.gameId;
        });
      }
      $scope.filterStats();
    }

    var getConsideredGames = function(){
      var results = [];
      _.each($scope.allGames, function(value){
        if (value.isConsidered){
          results.push(value);
        }
      });
      return results;
    }
  });
