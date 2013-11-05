'use strict';

angular.module('iUtltimateApp')
  .controller('MainpageCtrl', function($scope, Rest, $location, $routeParams) {
    $scope.teamId = $routeParams.teamId; // change for production.
    var playerName = unHash($routeParams.playerName);
    $scope.selectedPlayerName = (playerName && playerName !== 'home') ? playerName : undefined;
    $scope.teamName = '';
    $scope.statsLoaded = false;
    $scope.minWindowHeight = window.innerHeight - 200 + 23;
    $scope.focused = 'players';
    $scope.navState = 'collapse';
    $scope.signedIn = 'yellow';
    $scope.windowWidth = window.innerWidth;
    $scope.windowHeight = window.innerHeight;
    $scope.notMobile = window.innerWidth > 500;
    $scope.pageFocus = function(value) {
      return value === $scope.focused;
    }
    $scope.selectPlayer = function(player) {
      $scope.selectedPlayer = player;
      $scope.selectedPlayerName = player.playerName;
      $location.url('/' + $scope.teamId + '/' + hash(player.playerName));
      $scope.changePageFocus('specificPlayer');
    }
    $scope.changePageFocus = function(value) {
      if (value !== 'specificPlayer') {
        $location.url('/' + $scope.teamId + '/home');
        $scope.$apply($scope.selectedPlayer = undefined);
        $scope.selectedPlayerName = '';
      }
      $scope.focused = value;
    }
    $scope.selectedPlayerName && $scope.changePageFocus('specificPlayer');
    $scope.toggleNav = function() {
      $scope.navState = $scope.navState ? '' : 'collapse'
    }
    $scope.toggleNavType = function() { // Changes the sub-nav-bar from a header to a drop down.
      $scope.navState = $scope.navState ? '' : 'in';
    }
    Rest.retrieveTeam($scope.teamId, false, function(response) {
      $scope.teamName = response.name;
      window.document.title = $scope.teamName + " Ultimate Team";
      $scope.$apply($scope.signedIn = 'green');
    }, function() {
      $scope.$apply($scope.signedIn = 'red');
    });
    $scope.signIn = function() {
      $scope.$apply($scope.signedIn = 'green');
    }

    function hash(str) {
      var result = '';
      for (var i = 0; i < str.length; i++) {
        var k = str[i].charCodeAt() + '';
        while (k.length < 3) {
          console.log(k);
          k = '0' + k;
        }
        result += k;
      }
      return result;
    };

    function unHash(str) {
      if (str) {
        var result = '';
        for (var i = 0; i < str.length; i += 3) {
          if(str.match(/[\d]+/)){
            result += window.String.fromCharCode(str.substring(i, i + 3));
          } else {
            result = undefined;
          }
        }
        return result;
      }
    };
  });