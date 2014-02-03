'use strict';

angular.module('newBetaApp')
  .directive('navBar', function (viewer, $routeParams, $location) {
    return {
      templateUrl: 'includes/partials/nav-bar.html',
      restrict: 'EA',
      scope: {
        page: '=',
        tabName: '='
      },
      link: function postLink(scope) {
        scope.isMobile = viewer.isMobile();
        scope.isActive = function(option){
          return option === scope.page ? 'active' : '';
        };
        scope.navTo = function(page){
          var path = '/' + $routeParams.teamId + '/' + page;
          if (page !== scope.page){ $location.path(path); }
        };
      }
    };
  });
