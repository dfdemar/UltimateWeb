'use strict';

angular.module('beta2App')
  .controller('PlayersCtrl', function ($scope,team) {
    team.then(function(results){
      console.log(results);
    })
  });
