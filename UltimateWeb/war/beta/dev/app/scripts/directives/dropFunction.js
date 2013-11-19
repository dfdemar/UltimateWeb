'use strict';

angular.module('iUtltimateApp')
  .directive('droppableArea', function () {
return {
            restrict: 'A',
            link: function(scope, el, attrs, controller) {
                var id = angular.element(el).attr("id");
                            
                el.bind("dragover", function(e) {
                    if (e.preventDefault) {
                      e.preventDefault(); // Necessary. Allows us to drop.
                  }
                   
                  if(e.stopPropagation) { 
                    e.stopPropagation(); 
                  }
 
                  return false;
                });
                 
                el.bind("dragenter", function(e) {
                });
                 
                el.bind("dragleave", function(e) {
                });
 
                el.bind("drop", function(e) {
                  scope.dropped(scope.line);
                });

            }
        }
  });
