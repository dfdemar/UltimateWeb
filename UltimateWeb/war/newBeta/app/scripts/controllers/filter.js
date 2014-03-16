/* global _ */

'use strict';

angular.module('newBetaApp')
  .controller('FilterCtrl', function($scope, filter, allGames) {
    $scope.dDOpen = false;
    $scope.filter = filter;
    $scope.filteredBy = 'All Games';
    allGames.then(function(games) {
      $scope.allGames = games;
      $scope.numberOfGames = Object.keys(games).length;
      $scope.mostRecentGame = _.max(games, function(item) {
        return item.msSinceEpoch;
      });
      $scope.tournaments = _.groupBy(games, 'tournamentName');
      $scope.mostRecentTournamentName = $scope.mostRecentGame.tournamentName;
      $scope.mostRecentTournament = $scope.mostRecentTournamentName ? $scope.tournaments[$scope.mostRecentGame.tournamentName] : null;
      if ($scope.tournaments && $scope.tournaments['undefined']) {
        $scope.tournaments['-'] = $scope.tournaments['undefined'];
        delete $scope.tournaments['undefined'];
      }
    });

    function orderLayout() {
      $scope.orderedTournaments = _.map($scope.tournaments,function(games) {
        return _.toArray(games).sort(function(a, b) {
          return b.msSinceEpoch - a.msSinceEpoch;
        });
      }).sort(function(a, b) {
        return b[0].msSinceEpoch - a[0].msSinceEpoch;
      });
    }
    $scope.collect = function() {
      orderLayout();
      $scope.dDOpen = true;
    };
    $scope.close = function() {$scope.dDOpen = false;};
    $scope.isIncluded = filter.contains;
    $scope.allIncluded = function(games){
      return _.reduce(games, function(memo, game){
        return memo && $scope.isIncluded(game);
      }, true);
    };
    $scope.toggleAll = function(games, choice){
      _.each(games, function(game){
        $scope.toggleSelect(game, choice);
      });
    };
    $scope.toggleSelect = function(game, choice){
      (!filter.contains(game) || choice) ? filter.include(game) : filter.exclude(game);
    };
  });