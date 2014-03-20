'use strict';

angular.module('newBetaApp')
  .directive('titleBar', ['teamName', function (teamName) {
    return {
      templateUrl: 'includes/partials/title-bar.html',
      restrict: 'EA',
      link: function postLink(scope) {
        teamName.then(function(name){
          scope.teamName = name;
          window.document.title = name || 'iUltimate';
        });
      }
    };
  }]);
