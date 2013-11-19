'use strict';

angular.module('iUtltimateApp')
  .controller('FilterCtrl', function ($scope) {
    $scope.message = {'All Games': []};
    $scope.modalController = {};
    $scope.filterButtonLabel = 'All Games';

    $scope.modalIsOpen = false;
    $scope.openModal = function(){
      $scope.modalIsOpen = true;
      angular.element('body').addClass('noscroll');
    };
    $scope.closeModal = function(){
      document.body.style.cursor = 'wait';
      setTimeout(function(){
        $scope.modalIsOpen = false;
        $scope.derivePlayerStats();
        $scope.$apply($scope.filterStats());
        document.body.style.cursor = 'default';
        angular.element('body').removeClass('noscroll');
      },200);
    };

    _.each($scope.allGames, function(game, index){
      $scope.$watch('allGames[' + index + '].isConsidered', function(){
        console.log(); // do not remove.
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
    });
    $scope.considerAll = function(){
      _.each($scope.allGames, function(value){
        value.isConsidered = true;
      });
      $scope.filterStats();
      $scope.$apply($scope.derivePlayerStats());
    };
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
      $scope.derivePlayerStats();
      $scope.filterStats();
    };
  });
