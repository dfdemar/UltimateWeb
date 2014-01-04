'use strict';

angular.module('beta2App')
  .directive('navBar', function (viewer, $routeParams, $location) {
    return {
      templateUrl: 'includes/partials/nav-bar.html',
      restrict: 'EA',
      scope: {
        page: '=',
        tabName: '='
      },
      link: function postLink(scope, element, attrs) {
        scope.isMobile = viewer.isMobile();
        scope.isActive = function(option){
          return option === scope.page ? 'active' : '';
        };
        scope.navTo = function(page){
          var path = '/' + page + '/' + $routeParams.teamId;
          page !== scope.page && $location.path(path);
        };
      }
    };
  });
