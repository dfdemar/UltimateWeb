// Generated by CoffeeScript 1.7.1
'use strict';
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

angular.module('newBetaApp').factory('Line', function($rootScope) {
  var Line;
  return Line = (function() {
    function Line() {
      this.getStats = __bind(this.getStats, this);
      this.addPlayer = __bind(this.addPlayer, this);
      this.id = String(Math.random());
      this.players = [];
    }

    Line.prototype.addPlayer = function(player) {
      this.players = _.union(this.players, [player]);
      return $rootScope.$digest();
    };

    Line.prototype.removePlayer = function(player) {
      return this.players = _.without(this.players, player);
    };

    Line.prototype.getStats = function() {
      return console.log('todo');
    };

    return Line;

  })();
});
