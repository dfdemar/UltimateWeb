'use strict';

angular.module('iUtltimateApp')
  .filter('percent', function () {
    return function (input) {
      if (input && input.toFixed){
        return input <= 1 ? 
        (input * 100).toFixed(0) + '%' : 
        Math.floor(input) === input ?
          input + '%':
          input.toFixed(2) + '%';
      }
    };
  });
