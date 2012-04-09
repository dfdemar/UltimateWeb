var ieVersion = getInternetExplorerVersion();
if (ieVersion > 5 && ieVersion < 9) {
	alert("Ewww. We see you are using a version of Internet Explorer prior to version 9 (or running your new version in compatibility mode).  This application hasn't been tested on this browser.  We recommend Chrome, Firefox, Safari or Internet Explorer 9 or above.  You can also use this site on most mobile web browsers.")
}

Ultimate.headingForProperty = {
	playerName : 'Player',
	gamesPlayed : 'Games played',
	pointsPlayed : 'Points played',
	opointsPlayed : 'O-line pts played',
	dpointsPlayed : 'D-line pts played',
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


$('.pagediv').live('pageinit', function(event, data) {
	registerPageSwipeHandler('mainpage', 'swipeleft', '#gamespage');
	registerPageSwipeHandler('gamespage', 'swiperight', '#mainpage');
});

function registerPageSwipeHandler(pageSource, swipeEvent, pageTarget) {
	$('#' + pageSource).off(swipeEvent).on(swipeEvent, function(event, data) { // off called because need to ensure only one swipe handler
		$.mobile.changePage(pageTarget, {
			transition : 'slide',
			reverse : swipeEvent == 'swiperight'
		});
	});
}

$(document).live('pagechange', function(event, data) {
	var toPageId = data.toPage.attr("id");
	switch (toPageId) {
		case 'gamespage':
			renderGamesPage(data);
			break;
		case 'eventspage' :
			renderGameEventsPage(data);
			break;
		case 'gamestatspage' :
			renderGameStatsPage(data);
			break;
		case 'playerstatspage' :
			renderPlayerStatsPage(data);
			break;				
		default:
			renderMainPage(data);
	}
});

function renderMainPage(data) {
	populateTeam(function() {
		populatePlayersList();
	});
}

function renderGamesPage(data) {
	populateTeam(function() {
		populateGamesList();
	});
}

function renderGameEventsPage(data) {
	populateTeam(function() {
		renderGamePageBasics(data)
		populateEventsList();
	});
}

function renderGameStatsPage(data) {
	populateTeam(function() {
		renderGamePageBasics(data);
		populateGamePlayerStats(data);
	});
}

function renderPlayerStatsPage(data) {
	populateTeam(function() {
		renderGamePageBasics(data);
		populateSelectGamesControl();
		populatePlayerStats(data);
	});
}


function renderGamePageBasics(data) {
	Ultimate.gameId = data.options.pageData.gameId;
	$('.gameStatsChoiceLink').attr('href','#gamestatspage?gameId=' + Ultimate.gameId);
	$('.gameEventsChoiceLink').attr('href', '#eventspage?gameId=' + Ultimate.gameId);
}

function populateTeam(successFunction) {
	if (isNullOrEmpty(Ultimate.teamId)) {
		$('.teamName').html("Team Not Found");
	} else {
		if (!Ultimate.teamName) {
			retrieveTeam(Ultimate.teamId, true, function(team) {
				Ultimate.team = team;
				Ultimate.teamName = team.name;
				$('.teamName').html(Ultimate.teamName);
				if (successFunction) {
					successFunction();
				}
			}) 
		} else {
			$('.teamName').html(Ultimate.teamName);
			if (successFunction) {
				successFunction();
			}
		}
	}
}

function populatePlayersList() {
	if (!Ultimate.team) {
		retrieveTeam(Ultimate.teamId, true, function(team) {
			Ultimate.team = team;
			updatePlayersList(team.players);
		}) 
	} else {
		updatePlayersList(Ultimate.team.players);
	}
}

function updatePlayersList(players) {
		var html = [];
		for ( var i = 0; i < players.length; i++) {
			var player = players[i];
			html[html.length] = '<li><a href="#playerstatspage?name=';
			html[html.length] = encodeURIComponent(player.name);
			html[html.length] = '">'
			html[html.length] = player.name;
			html[html.length] = '</a></li>';
		}
		$("#players").empty().append(html.join('')).listview("refresh");
}

function populateGamesList() {
	if (!Ultimate.games) {
		retrieveGames(Ultimate.teamId, function(games) {
			Ultimate.games = games;
			updateGamesList(Ultimate.games);
		}) 
	} else {
		updateGamesList(Ultimate.games);
	}
}

function updateGamesList(games) {
	var sortedGames = sortGames(games);
	var html = [];
	for ( var i = 0; i < sortedGames.length; i++) {
		var game = sortedGames[i];
		html[html.length] = '<li><a href="#eventspage?gameId=';
		html[html.length] =  game.gameId;
		html[html.length] = '">';
		html[html.length] = '<span class="game-date">';
		html[html.length] = game.date;
		html[html.length] = '&nbsp;&nbsp;';
		html[html.length] = game.time;
		html[html.length] = '</span>&nbsp;&nbsp;';		
		html[html.length] = '<span class="opponent">vs. ';
		html[html.length] = game.opponentName;
		html[html.length] = '</span>';
		html[html.length] = '<span class="tournament">';
		html[html.length] = isBlank(game.tournamentName) ?  '&nbsp;&nbsp;&nbsp;' : '&nbsp;&nbsp;at ' + game.tournamentName;
		html[html.length] = '</span>&nbsp;&nbsp;';		
		html[html.length] = '<span class="score '; 
		html[html.length] = game.ours > game.theirs ? 'ourlead' : game.theirs > game.ours ? 'theirlead' : ''; 
		html[html.length] = '">';
		html[html.length] = game.ours;
		html[html.length] = '-';
		html[html.length] = game.theirs;
		html[html.length] = '</span>';
		html[html.length] = '</a></li>';
	}
	$("#games").empty().append(html.join('')).listview("refresh");
}

function isBlank(s) {
	return s == null || s == '';
}

function populateEventsList() {
	retrieveGame(Ultimate.teamId, Ultimate.gameId, function(game) {
		Ultimate.game = game;
		updateGamePointsList(Ultimate.game);
		populateGameTitle();
	}) 
}

function populateGamePlayerStats(data) {
	retrieveGame(Ultimate.teamId, Ultimate.gameId, function(game) {
		Ultimate.game = game;
		populateGameTitle();
		retrievePlayerStatsForGames(Ultimate.teamId, [Ultimate.gameId], function(playerStats) {
			Ultimate.playerStats = playerStats;
			if (document.documentElement.clientWidth < 900) {
				populateMobileGamePlayerStatsData(data);
			} else {
				populateWideGamePlayerStatsData(data);  
			}
		}) 
	}) 
}

function populateMobileGamePlayerStatsData(data) {
	$('#wideTeamPlayerStats').addClass('hidden');
	updatePlayerRankingsTable(data.options.pageData.ranktype);
	$('#selectPlayerRank').unbind('change').on('change', function() {
		updatePlayerRankingsTable($(this).val());
	});
	$('#mobileTeamPlayerStats').removeClass('hidden');
}

function populateWideGamePlayerStatsData(data) {
	$('#mobileTeamPlayerStats').addClass('hidden');
	if (Ultimate.teamStatsTemplate == null) {
		Ultimate.teamStatsTemplate = Handlebars.compile($("#teamPlayerStatsTableTemplate").html());
	}
	$statsTable = $('#wideTeamPlayerStats');
	$statsTable.html(Ultimate.teamStatsTemplate(statsTable()));
	$statsTable.removeClass('hidden');
}

function populatePlayerStats(data, gamesToIncludeSelection) {
	$('#statsPlayerNameHeading').html('');
	$('#playerStats').hide();
	Ultimate.playerName = decodeURIComponent(data.options.pageData.name);
	var includeType = gamesToIncludeSelection == null ? 'AllGames' : gamesToIncludeSelection;
	var retrieveFunctions = {
			'LastGame': retrievePlayerStatsForLastGame,
			'AllGames': retrievePlayerStatsForAllGames,
			'LastTournament': retrievePlayerStatsForLastTournament
			}
	var retrieveFn = retrieveFunctions[includeType];
	var options = {teamId: Ultimate.teamId};
	if (retrieveFn == null) { 
		retrieveFn = retrievePlayerStatsForGame;
		options.gameId = gamesToIncludeSelection;
	}
	retrieveFn(options, function(playerStatsArray) {
		$('#selectGamesForPlayerStats').val(includeType).selectmenu('refresh');
		$('#statsPlayerNameHeading').html(Ultimate.playerName);
		updatePlayerStatsTable(statsForPlayer(playerStatsArray, Ultimate.playerName));
		$('#playerStats').show();
		$('#selectGamesForPlayerStats').unbind('change').on('change', function() {
			populatePlayerStats(data, $(this).val());
		})
	}); 
}

function populateSelectGamesControl() {
	if (!Ultimate.games) {
		retrieveGames(Ultimate.teamId, function(games) {
			Ultimate.games = games;
			updateSelectGamesControl(Ultimate.games);
		}) 
	} else {
		updateSelectGamesControl(Ultimate.games);
	}
}

function updateSelectGamesControl(games) {
	var sortedGames = sortGames(games);
	var html = [];
	addGameSelection(html, 'AllGames', 'All Games');
	addGameSelection(html, 'LastGame', 'Last Team Game');
	addGameSelection(html, 'LastTournament', 'Last Tournament');
	for ( var i = 0; i < sortedGames.length; i++) {
		var game = sortedGames[i];
		var description = game.date + (isBlank(game.tournamentName) ?  ' ' : (' at ' + game.tournamentName)) + ' vs. ' +  game.opponentName + ' ';
		addGameSelection(html, game.gameId, description);
	}
	$("#selectGamesForPlayerStats").empty().html(html.join(''));
}

function addGameSelection(html, value, display) {
	html[html.length] = '<option value="';
	html[html.length] =  value;
	html[html.length] = '">';
	html[html.length] = display;
	html[html.length] = '</option>';
}

function populateGameTitle() {
	var game = Ultimate.game;
	$('.opponentTitle').html('vs. ' + game.opponentName);
	var $score = $('.gameScore');
	$score.html(game.ours + '-' + game.theirs);
	$score.addClass(game.ours > game.theirs ? 'ourlead' : game.theirs > game.ours ? 'theirlead' : '');
	$('.gameDetails').html(game.date + ' ' + game.time + (isBlank(game.tournamentName) ?  '' : ' at ' + game.tournamentName));
}

function updateGamePointsList(game) {
	Ultimate.points = JSON.parse(game.pointsJson).reverse();
	var html = [];
	for ( var i = 0; i < Ultimate.points.length; i++) {
		var point = Ultimate.points[i];
		var score = point.summary.score;
		var elapsedTime = point.summary.elapsedTime;
		elapsedTime = elapsedTime == null ? '' : ' (' + secondsToMinutes(elapsedTime, 1) + ' minutes)';
		html[html.length] = '<div data-role="collapsible" data-index="';
		html[html.length] = i;
		html[html.length] = '"><h3>';
		html[html.length] = score.ours;
		html[html.length] = '-';
		html[html.length] = score.theirs;
		html[html.length] = '&nbsp;&nbsp;';
		html[html.length] = point.summary.lineType == 'O' ? 'O-line' : 'D-line';
		html[html.length] = '&nbsp;&nbsp;';
		html[html.length] = point.summary.finished ? elapsedTime : ' (unfinished point)';
		html[html.length] = '</h3><ul data-role="listview" data-inset="true" data-theme="c"></div>';
	}
	$('#points').empty().append(html.join('')).trigger('create');
	$('#points div[data-role="collapsible"]').live(
			'expand', function() {
				var point = Ultimate.points[$(this).data('index')];
				populatePointEvents($(this));
			});
}

function updatePlayerRankingsTable(rankingType) {
	var rankingType = rankingType == null ? 'pointsPlayed' : rankingType;
	$('#selectPlayerRank').val(rankingType).selectmenu('refresh');
	var rankings = playerRankingsFor(rankingType);
	var html = [];
	var statDescription = $("#selectPlayerRank :selected").text();
	addRowToStatsTable(html,'<strong>Player</strong>','<strong>' + statDescription + '</strong>', isPerPointStat(rankingType) ? 
			'<strong>per point played</strong>' : '');
	addRowToStatsTable(html,'&nbsp;','&nbsp;');
	var total = 0;
	for (var i = 0; i < rankings.length; i++) {
		var value = rankings[i].value;
		if (rankingType == 'secondsPlayed') {
			value = secondsToMinutes(value);
		}
		var perPoint = rankings[i].perPoint;
		addRowToStatsTable(html,rankings[i].playerName, value, perPoint);
		total += value;
	}
	if (rankingType.indexOf("Played") < 0)	 {
		addRowToStatsTable(html,'&nbsp;','&nbsp;');
		addRowToStatsTable(html,'<strong>Total</strong>', '<strong>' + total + '</strong>', '&nbsp;');
	}
	$('#playerRankings tbody').html(html.join(''));
}

function addRowToStatsTable(html, name, stat1, stat2) {
	html[html.length] = '<tr><td class="statsTableDescriptionColumn">';
	html[html.length] = name;
	html[html.length] = '</td><td class="statsTableValueColumn1">';
	html[html.length] = stat1;
	html[html.length] = '</td><td class="statsTableValueColumn2">';
	html[html.length] = stat2;	
	html[html.length] = '</td></tr>';
}

function updatePlayerStatsTable(playerStats) {
	var html = [];
	var headings = Ultimate.headingForProperty;
	if (playerStats) {
		addRowToStatsTable(html,'<strong>Statistic</strong>','<strong>Value</strong>','<strong>Per Point Played</strong>');
		addRowToStatsTable(html,'&nbsp;','&nbsp;');
		addRowToStatsTable(html,headings.gamesPlayed,playerStats.gamesPlayed);
		addRowToStatsTable(html,headings.pointsPlayed,playerStats.pointsPlayed);
		addRowToStatsTable(html,headings.opointsPlayed,playerStats.opointsPlayed);
		addRowToStatsTable(html,headings.dpointsPlayed,playerStats.dpointsPlayed);
		addRowToStatsTable(html,headings.secondsPlayed,playerStats.secondsPlayed == null ? '' : secondsToMinutes(playerStats.secondsPlayed, 1));
		addRowToStatsTable(html,headings.touches,playerStats.touches, perPointPointStat(playerStats.touches, playerStats.pointsPlayed));
		addRowToStatsTable(html,headings.goals,playerStats.goals, perPointPointStat(playerStats.goals, playerStats.pointsPlayed));
		addRowToStatsTable(html,headings.assists,playerStats.assists, perPointPointStat(playerStats.assists, playerStats.pointsPlayed));
		addRowToStatsTable(html,headings.passes,playerStats.passes, perPointPointStat(playerStats.passes, playerStats.pointsPlayed));
		addRowToStatsTable(html,headings.catches,playerStats.catches, perPointPointStat(playerStats.catches, playerStats.pointsPlayed));
		addRowToStatsTable(html,headings.drops,playerStats.drops, perPointPointStat(playerStats.drops, playerStats.pointsPlayed));
		addRowToStatsTable(html,headings.throwaways,playerStats.throwaways, perPointPointStat(playerStats.throwaways, playerStats.pointsPlayed));
		addRowToStatsTable(html,headings.ds,playerStats.ds, perPointPointStat(playerStats.ds, playerStats.pointsPlayed));
		addRowToStatsTable(html,headings.pulls,playerStats.pulls, perPointPointStat(playerStats.pulls, playerStats.pointsPlayed));
	} else {
		addRowToStatsTable(html,'No Data','');
	}

	$('#playerStats tbody').html(html.join(''));
}

function populatePointEvents($pointEl) {
	var point = Ultimate.points[$pointEl.data('index')];
	var events = point.events.slice().reverse();
	var html = [];
	for ( var i = 0; i < events.length; i++) {
		var event = events[i];
		var description = eventDescription(event);
		html[html.length] = '<li data-theme="';
		html[html.length] = event.type == 'Offense' ? 'd' : 'c';
		html[html.length] = '">';
		html[html.length] = '<img src="/images/' + description.image + '" class="listImage">&nbsp;&nbsp;';
		html[html.length] = description.text;
		html[html.length] = '</li>';
	}
	$pointEl.find('ul[data-role="listview"]').empty().append(html.join(''))
			.listview("refresh");
}

function eventDescription(event) {
	switch (event.action) {
		case 'Catch':
			return {text: event.passer + ' to ' + event.receiver, image: 'big_smile.png'};
		case 'Drop' :
			return {text: event.receiver + ' dropped from ' + event.passer, image: 'eyes_droped.png'};
		case 'Throwaway':
			return {text: event.passer + ' throwaway', image: 'shame.png'};
		case 'D' :
			return {text: 'D by ' + event.defender, image: 'electric_shock.png'};
		case 'Pull' :
			return {text: 'Pull by ' + event.defender, image: 'nothing.png'};		
		case 'Goal':
			return {text: event.type == 'Offense' ? 
					'Our Goal (' + event.passer + ' to ' + event.receiver + ')' :
					'Their Goal', image: event.type == 'Offense' ? 'super_man.png' : 'cry.png'};		
		default:
			return {text: event.action, image: 'hearts.png'};
	}
}

function playerRankingsFor(statName) {
	var stats = Ultimate.playerStats;  // array of PlayerStats
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
}

function statsForPlayer(playerStatsArray, playerName) {
	var stats = null;
	jQuery.each(playerStatsArray, function() {
		if (this.playerName == playerName) {
			stats = this;
			return false;
		}
	})
	return stats;
}

function secondsToMinutes(seconds, decimalPositions) {
	return decimalPositions ? (seconds/60).toFixed(decimalPositions) : Math.round(seconds / 60);
	return decimalPositions ? seconds/60 : Math.round(seconds / 60);
}

function playerRankingsFor(statName) {
	var stats = Ultimate.playerStats;  // array of PlayerStats
	var rankings = [];
	jQuery.each(stats, function() {
		var value = this[statName];
		if (value > 0) {
			var ranking = {playerName: this.playerName, value: this[statName]};
			if (isPerPointStat(statName)) {
				ranking.perPoint = perPointPointStat(value, this.pointsPlayed);
			}
			rankings.push(ranking);
		}
	})
	rankings.sort(function (a, b) {
		return b.value - a.value;
	})
	return rankings;
}

function isPerPointStat(statName) {
	return statName.indexOf('Played') < 0;
}

function perPointPointStat(value, denominator) {
	if (denominator && value) {
		var perPoint = value / denominator;
		return perPoint.toFixed(2);
	} else {
		return '';
	}
}

function statsTable() {
	return {
		playerStats : Ultimate.playerStats, /* array of PlayerStats */
		headings : Ultimate.headingForProperty /* hashtable of stattype/heading */
	};
}

