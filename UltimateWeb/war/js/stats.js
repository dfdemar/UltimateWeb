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
		if (teamStats.trendPoints.length > 1) {
			var touches = [];
			var drops = [];
			var throwaways = [];
			var turnovers = [];
			var turnoversPerTouch = [];
			for ( var i = 0; i < teamStats.trendPoints.length; i++) {
				p = teamStats.trendPoints[i];
				x = i + 1;
				turnoversPerTouch.push([x, p.turnoversPerTouch]);
			}
			$.plot($('#trendLineGraph'), 
					[
					 	{label: 'Turnovers per Touch', data: turnoversPerTouch, color: '#334066'}, 
					 ],
				{
					grid: {
						backgroundColor: { colors: ["#fff", "#eee"] }
					},
					xaxis: {
						tickFormatter: function(value) {return '';}  // hides x-axis numbers (but grid still shows)
					}
				});
		} else {
			$('#trendLineGraph').html('<br><br><br><h4 class="notEnoughData">Not Enough Data for this Graph</h4>');
		}
	}
	
	this.renderGoalPerOpportunityGraph = function() {
		
		var windSummary = teamStats.windSummary;
		var ourStats = goalOpportunitySummary(windSummary.windUnknown.ourStats, windSummary.lowWind.ourStats, windSummary.strongWind.ourStats);
		var theirStats = goalOpportunitySummary(windSummary.windUnknown.theirStats, windSummary.lowWind.theirStats, windSummary.strongWind.theirStats);

		var ourData = [
		               [1, ourStats.all], [2, ourStats.unknown], [3, ourStats.lowWind], 
		               [4, ourStats.strongAgainstWind],[5, ourStats.strongWithWind], [6, ourStats.strongAcrossWind]
		];
		var theirData = [
		                 [1, theirStats.all], [2, theirStats.unknown], [3, theirStats.lowWind], 
		                 [4, theirStats.strongAgainstWind],[5, theirStats.strongWithWind], [6, theirStats.strongAcrossWind]
        ];
		
	    var data = [
             {
                 label: Ultimate.teamName,
                 data: ourData,
                 bars: {
                     show: true,
                     barWidth: 0.3,
                     fill: true,
                     lineWidth: 1,
                     order: 1,
                     fillColor:  "#999900"
                 },
                 color: "#999900"
             },
             {
                 label: "Opponents",
                 data: theirData,
                 bars: {
                     show: true,
                     barWidth: 0.3,
                     fill: true,
                     lineWidth: 1,
                     order: 2,
                     fillColor:  "#334066"
                 },
                 color: "#334066"
             }
	     ];
	    
	    $.plot($("#goalPerOpportunityGraph"), data, {
            selection: { mode: "xy" },
            grid: {  },
            xaxis:{ 
               	ticks:[[1,'All'],[2,'Unknown Wind'],[3,'Low Wind'],[4,'Strong Upwind'],[5,'Strong Downwind'],[6,'Strong Crosswind']]
             },
            yaxis:{ 
               	min:0,
               	max:100,
            },
            valueLabels: { show: true },
            multiplebars: true
	    });
	}
	
	function goalOpportunitySummary(windUnknownStats, lowWindStats, strongWindStats) {
		var lowWindGoals = lowWindStats.goalsWithWind.goals + lowWindStats.goalsAgainstWind.goals + lowWindStats.goalsAcrossWind.goals;
		var lowWindOpps = lowWindStats.goalsWithWind.opportunties + lowWindStats.goalsAgainstWind.opportunties + lowWindStats.goalsAcrossWind.opportunties;
		var strongWindGoals = strongWindStats.goalsWithWind.goals + strongWindStats.goalsAgainstWind.goals + strongWindStats.goalsAcrossWind.goals;
		var strongWindOpps = strongWindStats.goalsWithWind.opportunties + strongWindStats.goalsAgainstWind.opportunties + strongWindStats.goalsAcrossWind.opportunties;		
		var totalGoals = windUnknownStats.goalsWindUnknown.goals + lowWindGoals + strongWindGoals;
		var totalOpps = windUnknownStats.goalsWindUnknown.opportunties + lowWindOpps + strongWindOpps;
		return {
			all: goalsPerOpp(totalGoals,totalOpps),
			unknown: goalsPerOpp(windUnknownStats.goalsWindUnknown.goals,windUnknownStats.goalsWindUnknown.opportunties),
			lowWind: goalsPerOpp(lowWindGoals,lowWindOpps),
			strongAgainstWind: goalsPerOpp(strongWindStats.goalsAgainstWind.goals,strongWindStats.goalsAgainstWind.opportunties),
			strongWithWind: goalsPerOpp(strongWindStats.goalsWithWind.goals,strongWindStats.goalsWithWind.opportunties),
			strongAcrossWind: goalsPerOpp(strongWindStats.goalsAcrossWind.goals,strongWindStats.goalsAcrossWind.opportunties),
		}
	}
	
	function goalsPerOpp(goals, opps) {
		return opps > 0 ? goals / opps * 100 : 0;
	}
	
	function renderGoalsSummaryPieChart($container, oLineGoals, dLineGoals) {
		var data = [];
		data.push({label: isNarrowDevice() ? 'O' : 'O-line', data: oLineGoals, color: '#999900' });  
		data.push({label: isNarrowDevice() ? 'D' : 'D-line', data: dLineGoals, color: '#334066'});
		$.plot($($container), data,
			{
	        	series: {
	        		pie: {
	        			show: true,
	        	        label: {
	        	            show: true,
	        	            formatter: function(label, series) {
	        	                return isNarrowDevice() ? 
	        	                		'<div class="pieLabel">' + label + '</div>' :
	        	                		'<div class="pieLabel">' + label + '<br/>'+Math.round(series.percent) + '%</div>';
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

