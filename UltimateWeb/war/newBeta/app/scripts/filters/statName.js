'use strict';

angular.module('newBetaApp')
  .filter('statName', function () {
    return function (name) {
      switch (name){
      case '':
        return '';
      default:
        return name[0].toUpperCase() + name.slice(1);
      }
    };
  });
