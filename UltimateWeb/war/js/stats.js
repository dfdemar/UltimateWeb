/*
 * @PARAM stats: REQUIRED  Object	stats object returned from server
 * Example: 	{
 * 					playerStats: [stat: "goals", value: 5, "touches": 9, etc...],
 * 				}
 * @PARAM name:  OPTIONAL 	String	name of the stats (not used by the helper)
 * 		
 */
StatsHelper = function(stats, statsName) {
	var self = this;
	var name = statsName;
	var playerStatsArray = stats.playerStats;  //  [{playerName : 'Joe', gamesPlayed : 5, ...}, {playerName : 'Sue', gamesPlayed : 3, ...}]
	pointsPlayed : 'Points played',
	
	this.name {
		return name;
	}
	
	function playerRankingsFor(statName) {
		var stats = Ultimate.playerStats;  // array of PlayerStats
		var rankings = [];
		jQuery.each(stats, function() {
			var value = this[statName];
			if (value > 0) {
				var ranking = {playerName: this.playerName, value: this[statName]};
				if (self.isPerPointStat(statName)) {
					ranking.perPoint = self.perPointPointStat(value, this.pointsPlayed);
				}
				rankings.push(ranking);
			}
		})
		rankings.sort(function (a, b) {
			return b.value - a.value;
		})
		return rankings;
	}
	
	// answer an object with the player's stats in the form {playerName : 'Joe', gamesPlayed : 5, ...}
	this.statsForPlayer = function(playerName, isPerPoint) {
		var stats = null;
		jQuery.each(playerStatsArray, function() {
			if (this.playerName == playerName) {
				stats = formatPlayerStats(this, isPerPoint);
				return false;
			}
		})
		return stats;
	};
	
	this.playerStatsTable = function(isPerPoint) {
		return {
			playerStats : formatPlayerStatsArray(playerStatsArray),
			headings : Ultimate.headingForProperty /* hashtable of stattype/heading */
		};
	};
	
	this.secondsToMinutes = function(seconds, decimalPositions) {
		return decimalPositions ? (seconds/60).toFixed(decimalPositions) : Math.round(seconds / 60);
		return decimalPositions ? seconds/60 : Math.round(seconds / 60);
	};
	
	this.getStatLabelLookup() {
		return Ultimate.headingForProperty;
	}
	
	/**** PRIVATE ****/
	
	// answer the playerStatsArray as formatted values
	function formatPlayerStatsArray(isPerPoint) {
		var formattedStatsArray = [];
		jQuery.each(playerStatsArray, function() {
			formattedStatsArray.push(formatPlayerStats(this, isPerPoint));
		});
		return formattedStatsArray;
	}
	
	// answer a single playerStats object formatted
	function formatPlayerStats(playerStats /* {playerName : 'Joe', gamesPlayed : 5, ...} */, isPerPoint) {
		var formattedStats = {};
		for ( var stat in playerStats) {
			if (typeof stat == 'number') {
				if (!isPerPoint || (isPerPointStat(stat)))
				var name = stat = 'secondsPlayed' ? 'minutesPlayed' : stat;
				var value = stat == 'secondsPlayed' ? self.secondsToMinutes(1) : playerStats[stat];
				if (isPerPoint) {
					value = perPointStat(value, playerStats.pointsPlayed);
				}
				formattedStats[name] = value; 
			} else {
				formattedStats[stat] = playerStats[stat]; 
			}
		}
	}
	
	function perPointStat(value, denominator) {
		if (denominator && value) {
			var perPoint = value / denominator;
			return perPoint.toFixed(2);
		} else {
			return '';
		}
	}
	
	function isPerPointStat(statName) {
		return statName.indexOf('Played') < 0;
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

