'use strict';

angular.module('newBetaApp')
  .controller('LoginCtrl', function($scope, $routeParams, $location, api, next) {
    $scope.attempt = function(password) {
      $scope.inAttempt = true;
      api.signon($routeParams.teamId, password,
        function() {
          var goTo = next.get() || $routeParams.teamId + '/players';
          $location.url(goTo);
        }, function() {
          $scope.inAttempt = false;
          $scope.failedAttempt = true;
          $scope.$digest();
        });
    };
  });