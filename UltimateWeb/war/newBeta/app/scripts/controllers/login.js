'use strict';

angular.module('newBetaApp')
  .controller('LoginCtrl', function($scope, $routeParams, $location, api, next) {
    $scope.attempt = function(password) {
      if (password){
        console.log(password);
        $scope.inAttempt = true;
        api.signon($routeParams.teamId, password,
          function() {
            var goTo = next.get();
            debugger;
            goTo ? $location.path(goTo) : $location.path($routeParams.teamId + '/players');
            $scope.$apply();
          }, function() {
            $scope.inAttempt = false;
            $scope.failedAttempt = true;
            $scope.$digest();
          });
      }
    };
  });