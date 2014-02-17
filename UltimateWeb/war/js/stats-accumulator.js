/****************  PLAYER STATS ACCUMULATOR ********************/

/* 	
	Summarizes raw game data for a team, producing the same player stats object that is 
	returned by retrievePlayerStatsForGames(), AKA endpoint /team/{teamId}/stats/player.
	The game data should be in the same format as that returned by retrieveGamesData(),
	AKA /team/{teamId}/gamesdata.  That is, game objects with point data that is embedded JSON.
	
	Equivalent functionality to java class PlayerStatisticsCalculator
	 
*/
PlayerStatsAccumulator = function() {
	var UNREASONABLY_LONG_ELAPSED_TIME_MINUTES = 60; 
	var DEFAULT_POINT_ELAPSED_MINUTES = 5; 
	
	this.summarizeGameData = function(arrayOfGameData) {
		var allPlayerStats = {};
		for (var int = 0; int < arrayOfGameData.length; int++) {
			updateStatsForGame(allPlayerStats, arrayOfGameData[i]);
		}
		return allPlayerStats;
	}
	
	function updateStatsForGame(allPlayerStats, game) {
		var playedInGame = [];
		var points = JSON.parse(game.pointsJson);
		for (var int = 0; int < points.length; int++) {
			var point = points[i];
			updatePointsPlayedStats(allPlayerStats, point, playedInGame);
			
			var events = point.events;
			var lastEvent = null;
			for (var int = 0; int < events.length; int++) {
				var event = events[i];
				var passer = isOffense(event) && event.passer != null ? getStatsForPlayer(event.passer) : null;
				var receiver = isOffense(event) && event.receiver != null ? getStatsForPlayer(event.receiver) : null;
				var defender = isDefense(event) && event.defender != null ? getStatsForPlayer(event.defender) : null;

				if (event.action == 'Catch') {
					passer.passes++;
					receiver.catches++;
					receiver.touches++;
					if (isFirstOffenseEvent(event, lastEvent)) {
						passer.touches++;
					}
				} else if (event.action == 'Drop') {
					passer.passes++;
					receiver.drops++;
					receiver.plusMinusCount--;
					if (isFirstOffenseEvent(event, lastEvent)) {
						passer.touches++;
					}
				} else if (isOffense(event) && (event.action == 'Throwaway' || event.action == 'Stall' || event.action == 'MiscPenalty')) {
					passer.passes++;
					if (event.action == 'Throwaway') {
						passer.throwaways++;
					} else if (event.action == 'Stall') {
						passer.stalls++;
					} else if (event.action == 'MiscPenalty') {
						passer.miscPenalties++;
					}
					passer.plusMinusCount--;
					if (isFirstOffenseEvent(event, lastEvent)) {
						passer.touches++;
					}
				} else if (event.action = 'Pull') {			
					defender.pulls++;
					updateHangtimeForPull(event, defender);
				} else if (event.action = 'PullOb') {	
					defender.pullsOB++;
				} else if (event.action = 'D') {				
					defender.ds++;
					defender.plusMinusCount++;
				} else if (event.action = 'Callahan') {					
					if (isDefense(event)) {
						defender.callahans++;
						defender.goals++;
						defender.ds++;
						defender.touches++;
						defender.plusMinusCount++;  
						defender.plusMinusCount++; // double for a callahan
						updatePlusMinusLine(allPlayerStats, point, true, isOline(point));
					} else {
						passer.passes++;
						passer.throwaways++;
						passer.callahaneds++;
						passer.plusMinusCount--;
						updatePlusMinusLine(allPlayerStats, point, false, isOline(point));
					}
				} else if (event.action = 'Goal') {		
					if (isOffense(event)) {
						passer.assists++;
						passer.passes++;
						receiver.touches++;
						receiver.goals++;
						receiver.catches++;
						passer.plusMinusCount++;
						receiver.plusMinusCount++;
						if (isFirstOffenseEvent(event, lastEvent)) {
							passer.touches++;
						}
					}
					updatePlusMinusLine(allPlayerStats, point, isOffense(event), isOline(point)) {
				}
				if (isOffense(event) && passer != null && passer.passes > 0) {
					var passPercent = (passer.passes - passerTurnovers(passer)) / passer.passes * 100;
					passer.passSuccess = Math.round(passPercent);
				}
				if (isOffense(event) && receiver != null && receiver.catches > 0) {
					var catchPercent = receiver.catches / (receiver.catches + receiver.drops) * 100;
					receiver.setCatchSuccess(Math.round(catchPercent));	
				}
				lastEvent = event;
			}
            updatePointsPlayedStats(allPlayerStats, point, playedInGame);
		}
		for (var int = 0; int < playedInGame.length; int++) {
			getStatsForPlayer(playedInGame[i]).gamesPlayed++;
		}
	}
	
	function updateTimePlayedStats(allPlayerStats, point) {
		if (point.line) {
			var playersInEntirePoint = playersInEntirePoint(point);
			var playersInPartOfPoint = playersInPartOfPoint(point);
			// players who played all of point
			for (var int = 0; int < playersInEntirePoint.length; int++) {
				var playerStats = getPlayerStats(allPlayerStats, playersInEntirePoint[i]);
				playerStats.secondsPlayed += elapsedTimeForPoint(point);
			}
			// players that were subbed in/out (ascribe half of the point time)
			for (var int = 0; int < playersInPartOfPoint.length; int++) {
				var playerStats = getPlayerStats(allPlayerStats, playersInPartOfPoint[i]);
				var elapsedTime = elapsedTimeForPoint(point);
				if (elapsedTime) {
					elapsedTime = elapsedTime / 2;
				}
				playerStats.secondsPlayed += elapsedTime;
			}
		}
	}

	function updatePointsPlayedStats(allPlayerStats, point, playedInGame) {
		if (point.line) {
			var playersInEntirePoint = playersInEntirePoint(point);
			var playersInPartOfPoint = playersInPartOfPoint(point);
			// players who played all of point
			for (var int = 0; int < playersInEntirePoint.length; int++) {
				var name = playersInEntirePoint[i];
				addPlayerName(playerInGame, name);
				var playerStats = getPlayerStats(allPlayerStats, name);
				playerStats.pointsPlayed++;
				if (isOline(point)) {
					playerStats.oPointsPlayed++;
				} else {
					playerStats.dPointsPlayed++;
				}
			}
			// players who played in part of point
			for (var int = 0; int < playersInPartOfPoint.length; int++) {
				var name = playersInPartOfPoint[i];
				addPlayerName(playerInGame, name);
				var playerStats = getPlayerStats(allPlayerStats, name);
				playerStats.pointsPlayed += .5;
				if (isOline(point)) {
					playerStats.oPointsPlayed += .5;
				} else {
					playerStats.dPointsPlayed += .5;
				}
			}
		}
	}
	
	function updatePlusMinusLine(allPlayerStats, point, isOurGoal, isOline) {
		if (point.line) {
			for (var int = 0; int < point.line.length; int++) {
				var playerName = point.line[i];
				var playerStats = getStatsForPlayer(playerName);
				if (isOurGoal) {
					if (isOline) {
						playerStats.plusMinusOLine++;
					} else {
						playerStats.plusMinusDLine++
					}
				} else {
					if (isOline) {
						playerStats.plusMinusOLine--;
					} else {
						playerStats.plusMinusDLine--;
					}
				}
			}
		}
	}

	// answer the players that played during the entire point (were not
	// substituted in or out)
	function playersInEntirePoint(point) {
		if (line) {
			if (point.substitutions) {
				var players = point.line.slice();
				for (var int = 0; int < point.substitutions.length; int++) {
					var fromPlayer = point.substitutions[i].fromPlayer;
					var toPlayer = point.substitutions[i].toPlayer;
					// drop both players that are part of a substitution
					removePlayerName(players, fromPlayer);
					removePlayerName(players, toPlayer);
				}
				return players;
			} else {
				return point.line
			}
		} else {
			return [];
		}
	}
	
	// answer the players that were substituted in or out during the point
	function playersInPartOfPoint(point) {
		if (point.substitutions) {
			var players = [];
			for (var int = 0; int < point.substitutions.length; int++) {
				var fromPlayer = point.substitutions[i].fromPlayer;
				var toPlayer = point.substitutions[i].toPlayer;
				// add both players that are part of a substitution
				addPlayerName(players, fromPlayer);
				addPlayerName(players, toPlayer);
			}
			return players;
		} else {
			return [];
		}
	}
	
	function getStatsForPlayer(allPlayerStats, playerName) {
		var playerStats = allPlayerStats[playerName];
		if (!playerStats) {
			playerStats = {};
			playerStats[playerName] = playerStats;
			
			playerStats.playerName = playerName;
			playerStats.plusMinusCount = 0;
			playerStats.plusMinusOLine = 0;
			playerStats.plusMinusDLine = 0;
			playerStats.gamesPlayed = 0;
			playerStats.pointsPlayed = 0;
			playerStats.oPointsPlayed = 0;
			playerStats.dPointsPlayed = 0;
			playerStats.goals = 0;
			playerStats.callahans = 0;
			playerStats.callahaneds = 0;
			playerStats.assists = 0;
			playerStats.passes = 0;
			playerStats.passSuccess = 0;
			playerStats.catches = 0;
			playerStats.catchSuccess = 0;
			playerStats.drops = 0;
			playerStats.throwaways = 0;
			playerStats.stalls = 0;
			playerStats.miscPenalties = 0;
			playerStats.ds = 0;
			playerStats.pulls = 0;
			playerStats.pullsWithHangtime = 0;
			playerStats.pullsOB = 0;
			playerStats.pullsTotalHangtime = 0;
			playerStats.pullsAvgHangtimeMillis = 0;
			playerStats.touches = 0;
			playerStats.secondsPlayed = 0;

		}
		return playerStats;
	}
	
	function removePlayerName(names, playerName) {
		var i = names.indexOf(playerName);
		if(i != -1) {
			names.splice(i, 1);
		} 
	}
	
	function addPlayerName(names, playerName) {
		// don't add it if already there
		for (var int = 0; int < names.length; int++) {
			if (names[i]) == playerName) {
				return;
			}
		}
		names.push(playerName);
	}
	
	function isOline(point) {
		return point.summary.lineType == 'O';
	}
	
	function isDline(point) {
		return point.summary.lineType == 'D';
	}
	
	function elapsedTimeForPoint(point) {
		var elapsedTime = point.summary.elapsedTime;
		if (!elapsedTime) {
			elapsedTime = 0;
		})
		return elapsedTime > UNREASONABLY_LONG_ELAPSED_TIME_MINUTES * 60 ? DEFAULT_POINT_ELAPSED_MINUTES * 60 : elapsedTime; 
	}
	
	function isOffense(event) {
		return event.type == 'Offense';
	}
	
	function isDefense(event) {
		return event.type == 'Defense';
	}
	
	function isFirstOffenseEvent(event, previousEvent) {
		return isOffense(event) && (previousEvent == null || !(isOffense(previousEvent)));
	}
	
	function getHangTime(event) {
		if (event.details) {
			if (event.details.hangtime) {
				return event.details.hangtime;
			}
		}
		return 0;
	}
	
	function updateHangtimeForPull(pullEvent, playerStat) {
		if (pullEvent.details && pullEvent.details.hangtime) {
			playerStat.pullsWithHangtime++;
			playerStat.pullsTotalHangtime += pullEvent.details.hangtime;
			playerStat.pullsAvgHangtimeMillis = playerStat.pullsTotalHangtime / playerStat.pullsWithHangtime;
		}
	}
	
	function passerTurnovers(playerStat) {}
		return playerStat.throwaways + playerStat.stalls + playerStat.miscPenalties;
	}
	
}
