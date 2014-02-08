'use strict';

angular.module('newBetaApp')
  .factory('teamStats', function($q, $routeParams, $rootScope, filter, api, allGames) {
    var deferred = $q.defer();
    var statsMap = {};
    var collection = 0
    var goal;
    allGames.then(function(games){
      goal = _.keys(games).length;
      _.each(games, function(game, id){
        api.retrieveTeamStatsForGames($routeParams.teamId,[id],
          function success(result) {
            statsMap[id] = result;
            if (++collection === goal){
              deferred.resolve(tsApi);
            }
          },
          function failure(e) {
            deferred.reject(e);
          }
        );
      })
    });
    var tsApi = {
      getFromIncluded: function(){
        var that = this;
        var result = {};
        var temp = $rootScope.$new();
        temp.included = filter.included;
        temp.$watchCollection('included', function(){
          _(result).extend(that.getFrom(filter.included));
        });
        return result;
      }, 
      getFrom: function(games){
        var result = {};

        // Record
        var record = {wins:0,losses:0}
        _(games).each(function(game){
          var gs = statsMap[game.gameId].goalSummary;
          gs.ourOlineGoals + gs.ourDlineGoals > gs.theirOlineGoals + gs.theirDlineGoals ? record.wins++ : record.losses++;
        });
        result.record = record;

        // Point Spread
        var ps = {ours:0, theirs: 0};
        _(games).each(function(game){
          var gs = statsMap[game.gameId].goalSummary;
          ps.ours += gs.ourDlineGoals + gs.ourOlineGoals;
          ps.theirs += gs.theirDlineGoals + gs.theirOlineGoals;
        });
        result.pointSpread = ps;

        // Conversion Rate

        _(games).each(function(game){
          _(game.points).each(function(point){

          });
        });
        return result;
      }
    }
    return deferred.promise;
  });
