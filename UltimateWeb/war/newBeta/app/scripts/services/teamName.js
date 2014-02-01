'use strict';

angular.module('newBetaApp')
  .factory('teamName', function ($q, team) {
    var deferred = $q.defer();
    team.then(function(result){
      deferred.resolve(result.name);
    });
    return deferred.promise;
  });
