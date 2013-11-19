'use strict';

angular.module('iUtltimateApp')
  .controller('SignonCtrl', function($scope, Rest, $location) {
    $scope.teamName = 'iUltimate';
    $scope.password = {
      input: ''
    };
    $scope.badInput = false;
    $scope.signin = function() {
      Rest.signon($scope.teamId, $scope.password.input, function() {}, function(response) {
        if (response.status === 200) {
          $scope.signIn();
        } else if (response.status === 401) {
          $scope.$apply($scope.badInput = true);
        } else {
          throw error;
        }
      });
    }
  });