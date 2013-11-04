'use strict';

angular.module('iUtltimateApp')
  .controller('LinepageCtrl', function($scope) {
    $scope.lines = [];
    $scope.dragging;
    $scope.dropped = function(line) {
      line.addPlayer($scope.dragging);
      $scope.dragging = undefined;
    };
    $scope.setDragging = function(player) {
      $scope.dragging = player;
    };
    $scope.makeLine = function() {
      $scope.lineCount++;
      $scope.lines.push(new Line());
    };
    $scope.deleteLine = function(index) {
      $scope.lines.splice(index, 1);
    };
    $scope.lineCount = 0;
    var Line = function() {
      this.players = [];
    };
    Line.prototype.addPlayer = function(player) {
      if (!_.contains(this.players, player)) {
        $scope.$apply(this.players.push(player));
        $scope.$apply(this.deriveStats());
      }
    };
    Line.prototype.removePlayer = function(player) {
      _.each(this.players, function(playa, index) {
        if (playa.name === player.name) {
          $scope.$apply(this.players.splice(index, 1));
        }
      }, this);
      $scope.$apply(this.deriveStats());
    };
    Line.prototype.deriveStats = function() {
      console.log('called');
      var considerablePoints = [];
      _.each($scope.allGames, function(game) {
        _.each(game.points, function(point) {
          var matchCount = 0;
          _.each(point.line, function(name) {
            _.each(this.players, function(player) {
              if (player.name === name) {
                matchCount++;
              }
            }, this);
          }, this);
          if (matchCount === this.players.length) {
            considerablePoints.push(point);
          }
        }, this);
      }, this);
      if (considerablePoints.length === 0) {
        this.stats = undefined;
      } else {
        this.stats = getLineStats(considerablePoints, this.players);

      }
    };
    $scope.makeLine();

    function getLineStats(points, players) {
      var perPointFunctions = [getScoringPercentage, getPlayerConnections, getP2P];
      var stats = {};
      stats.accumulator = {};
      _.each(points, function(point, index) {
        var isLast = points.length - 1 === index;
        _.each(perPointFunctions, function(func) {
          func.call(null, point, stats, isLast, players);
        });
      });
      delete stats.accumulator;
      return stats;
    }

    function getScoringPercentage(point, stats, end) {
      stats.accumulator.oPointGoals = stats.accumulator.oPointGoals || 0;
      stats.accumulator.dPointGoals = stats.accumulator.dPointGoals || 0;
      stats.accumulator.oPoints = stats.accumulator.oPoints || 0;
      stats.accumulator.dPoints = stats.accumulator.dPoints || 0;

      if (point.events[0].type === 'Offense') {
        stats.accumulator.oPoints++;
        if (point.events[point.events.length - 1].type === 'Offense') {
          stats.accumulator.oPointGoals++;
        }
      } else {
        stats.accumulator.dPoints++;
        if (point.events[point.events.length - 1].type === 'Offense') {
          stats.accumulator.dPointGoals++;
        }
      }
      if (end) {
        stats.scoringPercentage = (stats.accumulator.oPointGoals + stats.accumulator.dPointGoals) / (stats.accumulator.oPoints + stats.accumulator.dPoints) || '?';
        stats.dScoringPercentage = stats.accumulator.dPointGoals / stats.accumulator.dPoints || '?';
        stats.oScoringPercentage = stats.accumulator.oPointGoals / stats.accumulator.oPoints || '?';
      }

    }

    function getPlayerConnections(point, stats, end, players) {
      stats.connections = stats.connections || {};
      _.each(point.events, function(evnt) {
        if (evnt.passer && evnt.receiver && contains(players, evnt.passer) && contains(players, evnt.receiver)) {
          stats.connections[getHash(evnt.passer, evnt.receiver)] = stats.connections[getHash(evnt.passer, evnt.receiver)] || {};
          stats.connections[getHash(evnt.passer, evnt.receiver)][evnt.action] = stats.connections[getHash(evnt.passer, evnt.receiver)][evnt.action] + 1 || 1;
        }
      });
    }

    function contains(players, name) {
      var found = false;
      _.each(players, function(player) {
        if (player.name === name) {
          found = true;
        }
      });
      return found;
    }

    function getHash(player1, player2) {
      if (player1 > player2) {
        return player1 + ' - ' + player2;
      } else {
        return player2 + ' - ' + player1;
      }
    }

    function getP2P(points) {

    }
    $scope.prettify = function(str) { // I hid this, because it's ugly.
      switch (str) {
        case 'oScoringPercentage':
          return '% O-Points Scored';
          break;
        case 'dScoringPercentage':
          return '% D-Points Scored';
          break;
        case 'scoringPercentage':
          return '% Points Scored';
          break;
      }
      //todo;
      return str;
    }
  });