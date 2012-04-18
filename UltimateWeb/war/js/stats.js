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
	
	this.name = function() {
		return name;
	};
	
	this.playerRankingsFor = function(statName) {
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
	};
	
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
	
	this.playerStatsTable = function(isPerPoint, sortByStat) {
		return {
			playerStats : formatPlayerStatsArray(isPerPoint, sortByStat),
			headings : Ultimate.headingForProperty /* hashtable of stattype/heading */
		};
	};
	
	this.secondsToMinutes = function(seconds, decimalPositions) {
		return decimalPositions ? (seconds/60).toFixed(decimalPositions) : Math.round(seconds / 60);
		return decimalPositions ? seconds/60 : Math.round(seconds / 60);
	};
	
	this.getStatLabelLookup = function() {
		return Ultimate.headingForProperty;
	};
	
	/**** PRIVATE ****/
	
	/* answer the playerStatsArray with formatted values (optional sort player rows by stat)
	 * @PARAM playerStats REQUIRED Object e.g., {playerName : 'Joe', gamesPlayed : 5, ...}
	 * @PARAM isPerPoint OPTIONAL Boolean absolute or per point value?
	*/	
	function formatPlayerStatsArray(isPerPoint, sortByStat) {
		var formattedStatsArray = [];
		jQuery.each(playerStatsArray, function() {
			formattedStatsArray.push(formatPlayerStats(this, isPerPoint));
		});
		return sortPlayerStatsArray(formattedStatsArray, sortByStat);
	}
	
	/* answer a single playerStats object formatted
	 * @PARAM playerStats REQUIRED Object e.g., {playerName : 'Joe', gamesPlayed : 5, ...}
	 * @PARAM isPerPoint OPTIONAL Boolean absolute or per point value?
	*/
	function formatPlayerStats(playerStats, isPerPoint) {
		var formattedStats = {};
		for ( var stat in playerStats) {
			var value = (stat == 'secondsPlayed') ? self.secondsToMinutes(playerStats[stat], 1) : playerStats[stat];
			var name = (stat == 'secondsPlayed') ? 'minutesPlayed' : stat;
			if (typeof playerStats[stat] == 'number') {
				if (!isPerPoint || isPerPointStat(stat)) {
					if (isPerPoint) {
						value = perPointStat(value, playerStats.pointsPlayed);
					}
					formattedStats[name] = value; 					
				}
			} else {
				formattedStats[name] = value; 
			}
		}
		return formattedStats;
	}
	
	function perPointStat(value, denominator) {
		if (denominator && value) {
			var perPoint = value / denominator;
			return perPoint.toFixed(2);
		} else {
			return 0;
		}
	}
	
	function isPerPointStat(statName) {
		return statName.indexOf('Played') < 0;
	}
	
	//descending 
	function sortPlayerStatsArray(anArrayOfPlayerStats, stattype) {
		var stat = stattype == null ? 'playerName' : stattype;
		var sortedPlayerStats = anArrayOfPlayerStats.sort(stat == 'playerName' ? 
			function(a,b) {
				var first = a[stat] == null ? '' : a[stat].toLowerCase();
				var second = b[stat] == null ? '' : b[stat].toLowerCase();
				return (first<second?-1:(first>second?1:0)); 
			}: 
			function(a,b) {
				return b[stat] - a[stat];
			});
		return sortedPlayerStats;
	}
}

Ultimate.headingForProperty = {
	playerName : 'Player',
	gamesPlayed : 'Games played',
	pointsPlayed : 'Points played',
	opointsPlayed : 'O-line points played',
	dpointsPlayed : 'D-line points played',
	minutesPlayed : 'Minutes played',
	secondsPlayed : 'Seconds played',
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

