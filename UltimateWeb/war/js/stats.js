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
	
	this.goalOpportunitySummary = function(windUnknownStats, lowWindStats, strongWindStats) {
		var lowWindGoals = lowWindStats.goalsWithWind.goals + lowWindStats.goalsAgainstWind.goals + lowWindStats.goalsAcrossWind.goals;
		var lowWindOpps = lowWindStats.goalsWithWind.opportunties + lowWindStats.goalsAgainstWind.opportunties + lowWindStats.goalsAcrossWind.opportunties;
		var strongWindGoals = strongWindStats.goalsWithWind.goals + strongWindStats.goalsAgainstWind.goals + strongWindStats.goalsAcrossWind.goals;
		var strongWindOpps = strongWindStats.goalsWithWind.opportunties + strongWindStats.goalsAgainstWind.opportunties + strongWindStats.goalsAcrossWind.opportunties;		
		var totalGoals = windUnknownStats.goalsWindUnknown.goals + lowWindGoals + strongWindGoals;
		var totalOpps = windUnknownStats.goalsWindUnknown.opportunties + lowWindOpps + lowWindOpps;
		return {
			all: self.goalsPerOpp(totalGoals,totalOpps),
			unknown: self.goalsPerOpp(windUnknownStats.goalsWindUnknown.goals,windUnknownStats.goalsWindUnknown.opportunties),
			lowWind: self.goalsPerOpp(lowWindGoals,lowWindOpps),
			strongAgainstWind: self.goalsPerOpp(strongWindStats.goalsAgainstWind.goals,strongWindStats.goalsAgainstWind.opportunties),
			strongWithWind: self.goalsPerOpp(strongWindStats.goalsWithWind.goals,strongWindStats.goalsWithWind.opportunties),
			strongAcrossWind: self.goalsPerOpp(strongWindStats.goalsAcrossWind.goals,strongWindStats.goalsAcrossWind.opportunties),
		}
	}
	
	this.goalsPerOpp = function(goals, opps) {
		return opps > 0 ? goals / opps : 0;
	}
	
	this.renderGoalPerOpportunityGraph = function() {
		var windSummary = teamStats.windSummary;
		var ourStats = self.goalOpportunitySummary(windSummary.windUnknown.ourStats, windSummary.lowWind.ourStats, windSummary.strongWind.ourStats);
		var theirStats = self.goalOpportunitySummary(windSummary.windUnknown.theirStats, windSummary.lowWind.theirStats, windSummary.strongWind.theirStats);
		var statHeadings = {
				all: 'All',
				unknown: 'Unknown Wind',
				lowWind: 'Low Wind',
				strongAgainstWind: 'Strong Upwind',
				strongWithWind: 'Strong Downwind',
				strongAcrossWind: 'Strong Crosswind',
				
		}
		var ourData = [
		               [1, 0.8], [2, 0.6], [3, 0.2], 
		               [4, 0.3],[5, 0.5], [6, 0.7]
		];
		var theirData = [
		               [1, 0.8], [2, 0.6], [3, 0.2], 
		               [4, 0.3],[5, 0.5], [6, 0.7]
		];
//		     "data": [[statHeadings.all, ourStats.all], [statHeadings.unknown, ourStats.unknown], [statHeadings.lowWind, ourStats.lowWind], 
//		              [statHeadings.strongAgainstWind, ourStats.strongAgainstWind],[statHeadings.strongWithWind, ourStats.strongWithWind], [statHeadings.strongAcrossWind, ourStats.strongAcrossWind]]
//		     "data": [[statHeadings.all, theirStats.all], [statHeadings.unknown, theirStats.unknown], [statHeadings.lowWind, theirStats.lowWind], 
//		              [statHeadings.strongAgainstWind, theirStats.strongAgainstWind],[statHeadings.strongWithWind, theirStats.strongWithWind], [statHeadings.strongAcrossWind, theirStats.strongAcrossWind]]
		
	    var data = [
             {
                 label: Ultimate.teamName,
                 data: ourData,
                 bars: {
                     show: true,
                     barWidth: 12*24*60*60*300,
                     fill: true,
                     lineWidth: 1,
                     order: 1,
                     fillColor:  "#AA4643"
                 },
                 color: "#AA4643"
             },
             {
                 label: "Opponents",
                 data: theirData,
                 bars: {
                     show: true,
                     barWidth: 12*24*60*60*300,
                     fill: true,
                     lineWidth: 1,
                     order: 2,
                     fillColor:  "#89A54E"
                 },
                 color: "#89A54E"
             }
	     ];
	    
	    $.plot($("#goalPerOpportunityGraph"), data, {
	        xaxis: {
	            min: (new Date(2010, 11, 15)).getTime(),
	            max: (new Date(2011, 04, 18)).getTime(),
	            mode: "time",
	            timeformat: "%b",
	            tickSize: [1, "month"],
	            monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
	            tickLength: 0, // hide gridlines
	            axisLabel: 'Wind Strength/Direction',
	            axisLabelUseCanvas: true,
	            axisLabelFontSizePixels: 12,
	            axisLabelFontFamily: 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
	            axisLabelPadding: 5
	        },
	        yaxis: {
	            axisLabel: 'Value',
	            axisLabelUseCanvas: true,
	            axisLabelFontSizePixels: 12,
	            axisLabelFontFamily: 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
	            axisLabelPadding: 5
	        },
	        grid: {
	            hoverable: true,
	            clickable: false,
	            borderWidth: 1
	        },
	        legend: {
	            labelBoxBorderColor: "none",
	            position: "right"
	        },
	        series: {
	            shadowSize: 1
	        }
	    });
	     
	     
	     /*
		 *  "teamStats":{
      "windSummary":{
         "windUnknown":{
            "speedRange":{
               "from":0,
               "to":0
            },
            "ourStats":{
               "goalsWindUnknown":{
                  "goals":0,
                  "opportunties":0,
                  "goalsPerOpportunity":0.0
               },
               "goalsWithWind":{
                  "goals":0,
                  "opportunties":0,
                  "goalsPerOpportunity":0.0
               },
               "goalsAgainstWind":{
                  "goals":0,
                  "opportunties":0,
                  "goalsPerOpportunity":0.0
               },
               "goalsAcrossWind":{
                  "goals":0,
                  "opportunties":0,
                  "goalsPerOpportunity":0.0
               }
            },
            "theirStats":{
               "goalsWindUnknown":{
                  "goals":0,
                  "opportunties":0,
                  "goalsPerOpportunity":0.0
               },
               "goalsWithWind":{
                  "goals":0,
                  "opportunties":0,
                  "goalsPerOpportunity":0.0
               },
               "goalsAgainstWind":{
                  "goals":0,
                  "opportunties":0,
                  "goalsPerOpportunity":0.0
               },
               "goalsAcrossWind":{
                  "goals":0,
                  "opportunties":0,
                  "goalsPerOpportunity":0.0
               }
            }
         },
         "lowWind":{
            "speedRange":{
               "from":1,
               "to":10
            },
            "ourStats":{
               "goalsWindUnknown":{
                  "goals":0,
                  "opportunties":0,
                  "goalsPerOpportunity":0.0
               },
               "goalsWithWind":{
                  "goals":0,
                  "opportunties":0,
                  "goalsPerOpportunity":0.0
               },
               "goalsAgainstWind":{
                  "goals":0,
                  "opportunties":0,
                  "goalsPerOpportunity":0.0
               },
               "goalsAcrossWind":{
                  "goals":0,
                  "opportunties":0,
                  "goalsPerOpportunity":0.0
               }
            },
            "theirStats":{
               "goalsWindUnknown":{
                  "goals":0,
                  "opportunties":0,
                  "goalsPerOpportunity":0.0
               },
               "goalsWithWind":{
                  "goals":0,
                  "opportunties":0,
                  "goalsPerOpportunity":0.0
               },
               "goalsAgainstWind":{
                  "goals":0,
                  "opportunties":0,
                  "goalsPerOpportunity":0.0
               },
               "goalsAcrossWind":{
                  "goals":0,
                  "opportunties":0,
                  "goalsPerOpportunity":0.0
               }
            }
         },
         "strongWind":{
            "speedRange":{
               "from":11,
               "to":99
            },
            "ourStats":{
               "goalsWindUnknown":{
                  "goals":0,
                  "opportunties":0,
                  "goalsPerOpportunity":0.0
               },
               "goalsWithWind":{
                  "goals":2,
                  "opportunties":2,
                  "goalsPerOpportunity":1.0
               },
               "goalsAgainstWind":{
                  "goals":2,
                  "opportunties":7,
                  "goalsPerOpportunity":0.2857143
               },
               "goalsAcrossWind":{
                  "goals":0,
                  "opportunties":0,
                  "goalsPerOpportunity":0.0
               }
            },
            "theirStats":{
               "goalsWindUnknown":{
                  "goals":0,
                  "opportunties":0,
                  "goalsPerOpportunity":0.0
               },
               "goalsWithWind":{
                  "goals":1,
                  "opportunties":4,
                  "goalsPerOpportunity":0.25
               },
               "goalsAgainstWind":{
                  "goals":1,
                  "opportunties":2,
                  "goalsPerOpportunity":0.5
               },
               "goalsAcrossWind":{
                  "goals":0,
                  "opportunties":0,
                  "goalsPerOpportunity":0.0
               }
            }
         }
      },
      */

	}
	
	
	this.renderTrendGraph = function() {
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

