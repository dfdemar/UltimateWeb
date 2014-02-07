/* global _ */

'use strict';

angular.module('newBetaApp')
  .controller('StattablesCtrl', function($scope, $location,$routeParams, playerStats, filter) {
    $scope.changeFocus = function(type) {
      $scope.focus = type;
    };
    $scope.navTo = function(playerName){
      $location.url($routeParams.teamId + '/player/' + encodeURI(playerName));
    };
    playerStats.then(function(statsApi) {
      $scope.categories = [{
        name: 'Passing',
        statTypes: ['assists', 'completions', 'throwaways','stalls', 'passingPercentage']
      }, {
        name: 'Receiving',
        statTypes: ['goals','catches','touches','drops','catchingPercentage']
      }, {
        name: 'Playing Time',
        statTypes: ['gamesPlayed','pointsPlayed','timePlayedMinutes', 'oPoints', 'dPoints']
      }, {
        name: 'Defense',
        statTypes: ['ds','pulls','callahans','averagePullHangtime','oBPulls',]
      }, {
        name: 'Per Point',
        statTypes: ['ppGoals' ,'ppAssists', 'ppDs' , 'ppThrowaways' , 'ppDrops']
      }, ];
      $scope.focus = $scope.categories[0];
      $scope.games = filter.included;
      $scope.stats = statsApi.getFrom(filter.included);
      $scope.players = Object.keys($scope.stats);
      $scope.statTypes = Object.keys($scope.stats[$scope.players[0]].stats);
      $scope.$watchCollection('games', function() {
        $scope.stats = statsApi.getFrom(filter.included);
        $scope.statsArray = _($scope.stats).toArray();
        $scope.players = Object.keys($scope.stats);
        $scope.statTypes = Object.keys($scope.stats[$scope.players[0]].stats);
      });
      $scope.sorter = '-name';
      $scope.sort = function(obj, prop){
        var name;
        prop ? name = obj + '.' + prop : name = obj;
        ($scope.sorter === name) ? $scope.sorter = '-' + $scope.sorter : $scope.sorter = name;
      };
    });
  });
  