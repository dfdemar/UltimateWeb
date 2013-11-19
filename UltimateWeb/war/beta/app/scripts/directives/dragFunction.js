'use strict';

angular.module('iUtltimateApp')
  .directive('draggableThing', function () {

        return {
            restrict: 'A',
            link: function(scope, el, attrs, controller) {
                angular.element(el).attr("draggable", "true");
 
                var id = angular.element(el).attr("id");
                 
                el.bind("dragstart", function(e) {
                    scope.setDragging(scope.player);
                });
                 
                el.bind("dragend", function(e) {
                });
            }
        };
 
  });
