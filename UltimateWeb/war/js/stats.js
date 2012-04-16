
StatsHelper = function(stats /* array of PlayerStats */) {
	var self = this;
	var stats = stats;  
	
	this.playerRankingsFor = function(statName) {
		var rankings = [];
		jQuery.each(stats, function() {
			var value = this[statName];
			if (value > 0) {
				rankings.push({playerName: this.playerName, value: this[statName]});
			}
		})
		rankings.sort(function (a, b) {
			return b.value - a.value;
		})
		return rankings;
	};
	
	this.statsForPlayer = function(playerStatsArray, playerName) {
		var stats = null;
		jQuery.each(playerStatsArray, function() {
			if (this.playerName == playerName) {
				stats = this;
				return false;
			}
		})
		return stats;
	};
	
	this.isPerPointStat = function(statName) {
		return statName.indexOf('Played') < 0;
	};
	
	this.perPointPointStat = function(value, denominator) {
		if (denominator && value) {
			var perPoint = value / denominator;
			return perPoint.toFixed(2);
		} else {
			return '';
		}
	};
	
	this.statsTable = function() {
		return {
			playerStats : stats, /* array of PlayerStats */
			headings : Ultimate.headingForProperty /* hashtable of stattype/heading */
		};
	}
	
}

Ultimate.headingForProperty = {
	playerName : 'Player',
	gamesPlayed : 'Games played',
	pointsPlayed : 'Points played',
	opointsPlayed : 'O-line points played',
	dpointsPlayed : 'D-line points played',
	secondsPlayed : 'Minutes played',
	touches : 'Touches',
	goals : 'Goals',
	assists: 'Assists',
	passes : 'Throws',
	catches : 'Catches',
	drops : 'Drops',
	throwaways : 'Throw aways',
	ds : 'Ds',
	pulls : 'Pulls'
}

