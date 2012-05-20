/****************  TEAM STATS ********************/
/*
 * @PARAM stats: REQUIRED  Object	stats object returned from server
 * Example: 	{
 * 					playerStats: [stat: "goals", value: 5, "touches": 9, etc...],
 * 				}
 * @PARAM name:  OPTIONAL 	String	name of the stats (not used by the helper)
 * 		
 */
TeamStatsHelper = function(stats, statsName) {
	var self = this;
	var teamStats = stats.teamStats;
	var name = statsName;
	
	this.name = function() {
		return name;
	};
	
	this.renderGoalsSummaryPieCharts = function() {
		renderGoalsSummaryPieChart($("#ourGoalSummaryPie"), teamStats.goalSummary.ourOlineGoals, teamStats.goalSummary.ourDlineGoals); 
		renderGoalsSummaryPieChart($("#theirGoalSummaryPie"), teamStats.goalSummary.theirOlineGoals, teamStats.goalSummary.theirDlineGoals);
	};
	
	this.renderTrendGraph = function() {
		var touches = [];
		var drops = [];
		var throwaways = [];
		var turnovers = [];
		var turnoversPerTouch = [];
		for ( var i = 0; i < teamStats.trendPoints.length; i++) {
			p = teamStats.trendPoints[i];
			x = i + 1;
			touches.push([x, p.touches]);
			drops.push([x, p.drops]);
			throwaways.push([x, p.throwaways]);
			turnovers.push([x, p.turnovers]);
			turnoversPerTouch.push([x, p.touch ? p.turnovers / p.touch : 0]);
		}
		$.plot($('#trendLineGraph'), 
				[
				 	{label: 'Touches', data: touches, color: '#999900'}, 
				 	{label: 'Turnovers', data: turnovers, color: '#334066'}
				 ],
			{
				grid: {
					backgroundColor: { colors: ["#fff", "#eee"] }
				},
				xaxis: {
					tickFormatter: function(value) {return '';}  // hides x-axis numbers (but grid still shows)
				}
			});
	}
	
	function renderGoalsSummaryPieChart($container, oLineGoals, dLineGoals) {
		var data = [];
		data.push({label: 'O-line', data: oLineGoals, color: '#999900' });  
		data.push({label: 'D-line', data: dLineGoals, color: '#334066'});
		$.plot($($container), data,
			{
	        	series: {
	        		pie: {
	        			show: true,
	        	        label: {
	        	            show: true,
	        	            formatter: function(label, series) {
	        	                return '<div class="pieLabel">' + label + '<br/>'+Math.round(series.percent) + '%</div>';
	        	            }
	        	        }
	        		}
	        	},
	        	legend: {
	        		show: false
	        	}
			});
	}
}

/****************  PLAYER STATS ********************/
/*
 * @PARAM stats: REQUIRED  Object	stats object returned from server
 * Example: 	{
 * 					playerStats: [stat: "goals", value: 5, "touches": 9, etc...],
 * 				}
 * @PARAM name:  OPTIONAL 	String	name of the stats (not used by the helper)
 * 		
 */
PlayerStatsHelper = function(stats, statsName) {
	var self = this;
	var name = statsName;
	var playerStatsArray = stats.playerStats;  //  [{playerName : 'Joe', gamesPlayed : 5, ...}, {playerName : 'Sue', gamesPlayed : 3, ...}]
	pointsPlayed : 'Points played',
	
	this.name = function() {
		return name;
	};
	
	// answer an array of objects: {playerName: 'joe' : value: x}
	this.playerRankingsFor = function(statName) {
		var rankings = [];
		jQuery.each(playerStatsArray, function() {
			var value = this[statName == 'minutesPlayed' ? 'secondsPlayed' : statName];
			if (value) {
				if (statName == 'minutesPlayed') {
					value = secondsToMinutes(value);
				}
				var ranking = {playerName: this.playerName, value: value};
				if (self.isPerPointStat(statName)) {
					ranking.perPoint = perPointStat(value, this.pointsPlayed);
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
			headings : Ultimate.headingForProperty, /* hashtable of stattype/heading */
			isPerPoint: isPerPoint
		};
	};
	
	this.secondsToMinutes = function(seconds, decimalPositions) {
		return decimalPositions ? (seconds/60).toFixed(decimalPositions) : Math.round(seconds / 60);
		return decimalPositions ? seconds/60 : Math.round(seconds / 60);
	};
	
	this.getStatLabelLookup = function() {
		return Ultimate.headingForProperty;
	};
	
	this.isPerPointStat = function(statName) {
		return statName.indexOf('Played') < 0;
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
				if (!isPerPoint || self.isPerPointStat(stat)) {
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
				var aAsFloat = parseFloat(a[stat]) ;
				var bAsFloat = parseFloat(b[stat]);
				return bAsFloat - aAsFloat;
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

