'use strict';

angular.module('beta2App')
  .directive('titleBar', function ($routeParams) {
    return {
      templateUrl: 'includes/partials/title-bar.html',
      restrict: 'EA',
      link: function postLink(scope, element, attrs) {
        var teamId = false // todo;
        scope.pageName = teamId || 'iUltimate';

      }
    };
  });
//TODO: Include the team name correctly via a service.