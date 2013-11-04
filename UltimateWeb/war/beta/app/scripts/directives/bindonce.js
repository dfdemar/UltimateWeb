'use strict';

angular.module('iUtltimateApp')
  .directive('unbindable', function(){
    return {
        scope: true, // This is what lets us do the magic.
        controller: function( $scope, $element){ 
            $scope.$on('unbind', function(){ // Ref 3
              window.setTimeout(function(){ $scope.$destroy() }, 0);//Ref 5
            });
            $scope.$broadcast('unbind');
        }
    }
});