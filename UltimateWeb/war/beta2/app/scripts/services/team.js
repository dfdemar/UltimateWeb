'use strict';

angular.module('beta2App')
  .factory('team', function ($routeParams, $http) {
    var team = $http({type:'GET', url: 'http://www.ultimate-numbers.com/rest/view/team/224002?players=true&cachebuster=foo'});
    return team;
  });
