'use strict';

angular.module('newBetaApp')
  .directive('loading', function () {
    return {
      restrict: 'A',
      scope: {
        loading: '='
      },
      link: function preLink(scope, element, attrs){
          element.prepend('<span class="my-loading-icon 9827345987"><b>We Googling Homie</b><br><img width="30" src="images/ajax-loader.gif"></span>');
        scope.$watch('loading', function(newVal){
          _.each(element.children(), function(node){
            node.hidden = (node.classList.contains('9827345987') && !newVal) || (!node.classList.contains('9827345987') && newVal);
          });
        });
      }
    };
  });
