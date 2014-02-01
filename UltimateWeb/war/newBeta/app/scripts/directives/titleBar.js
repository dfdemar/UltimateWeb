  'use strict';

angular.module('newBetaApp')
  .directive('titleBar', function (teamName) {
    return {
      templateUrl: 'includes/partials/title-bar.html',
      restrict: 'EA',
      link: function postLink(scope, element, attrs) {
        teamName.then(function(name){
          var teamName = name;
          window.document.title = teamName || 'iUltimate';
        });
      }
    };
  });
