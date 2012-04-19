var ieVersion = getInternetExplorerVersion();
if (ieVersion > 5 && ieVersion < 9) {
	alert("Ewww. We see you are using a version of Internet Explorer prior to version 9 (or running your new version in compatibility mode).  This application hasn't been tested on this browser.  We recommend Chrome, Firefox, Safari or Internet Explorer 9 or above.  You can also use this site on most mobile web browsers.")
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
		showDeviceBasedTeamStats();
		isNarrowDevice() ? renderTeamByPlayerStats() : renderTeamStats();
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

function renderTeamByPlayerStats() {
	if (!Ultimate.team) {
		retrieveTeam(Ultimate.teamId, true, function(team) {
			Ultimate.team = team;
			updateTeamByPlayerStats();
		}) 
	} else {
		updateTeamByPlayerStats();
	}
}

function updateTeamByPlayerStats() {
	var players = Ultimate.team.players;
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

function renderTeamStats() {
	populateSelectGamesControl();
	populateTeamStats();
}

function populateTeamStats() {
	var gamesToIncludeSelection = getTeamsSelectionChoice();
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
		Ultimate.statsHelper = new StatsHelper({playerStats: playerStatsArray});
		$('#selectGamesForTeamStats').val(includeType).selectmenu('refresh');
		Ultimate.statType = 'playerName';
		populatePlayerStatsTable();
		$('#selectGamesForTeamStats').unbind('change').on('change', function() {
			populateTeamStats();
		});
		$('#statDenominatorRadioButtons input').unbind('click').on('click', function() {
			populateTeamStats();
		});
	}); 
}

function updateTeamStats() {
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

function showDeviceBasedPlayerStats() {
	var isNarrow = isNarrowDevice();
	$('#playerStatsNarrow').toggleClass('hidden', !isNarrow);
	$('#playerStatsWide').toggleClass('hidden', isNarrow);
}

function showDeviceBasedTeamStats() {
	var isNarrow = isNarrowDevice();
	$('#teamStatsNarrow').toggleClass('hidden', !isNarrow);
	$('#teamStatsWide').toggleClass('hidden', isNarrow);
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
		retrievePlayerStatsForGames(Ultimate.teamId, [Ultimate.gameId], function(playerStatsArray) {
			Ultimate.statType = 'playerName';
			Ultimate.statsHelper = new StatsHelper({playerStats: playerStatsArray});
			showDeviceBasedPlayerStats();
			if (isNarrowDevice()) {
				populateMobileGamePlayerStatsData(data.options.pageData.ranktype);
			} else {
				populatePlayerStatsTable();  
			}
		}) 
	}) 
}

function populateMobileGamePlayerStatsData(stattype) {
	updatePlayerRankingsTable(stattype);
	$('#selectPlayerRank').unbind('change').on('change', function() {
		updatePlayerRankingsTable($(this).val());
	});
}

function populatePlayerStatsTable() {
	$statsTable = $('.playerStats');
	var statsTable = Ultimate.statsHelper.playerStatsTable(!isAbsoluteDenominator(), Ultimate.statType);
	$statsTable.html(createTeamStatsTableHtml(statsTable));
	$("a[data-stattype='" + Ultimate.statType + "']").addClass('selectedColumn');
	$statsTable.find('th a').off().on('click', function() {
		Ultimate.statType = $(this).data('stattype');
		populatePlayerStatsTable();
	})
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
		Ultimate.statsHelper = new StatsHelper({playerStats: playerStatsArray});
		$('#selectGamesForTeamPlayerStats').val(includeType).selectmenu('refresh');
		$('#statsPlayerNameHeading').html(Ultimate.playerName);
		updateSinglePlayerStatsTable(Ultimate.playerName);
		$('#playerStats').show();
		$('#selectGamesForTeamPlayerStats').unbind('change').on('change', function() {
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
	$(".gameSelect").empty().html(html.join(''));
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
	var rankings = Ultimate.statsHelper.playerRankingsFor(rankingType);
	var html = [];
	var statDescription = $("#selectPlayerRank :selected").text();
	addRowToStatsTable(html,'<strong>Player</strong>','<strong>' + statDescription + '</strong>', 
			Ultimate.statsHelper.isPerPointStat(rankingType) ? '<strong>per point played</strong>' : '');
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

function updateSinglePlayerStatsTable(playerName) {
	var absolutePlayerStats = Ultimate.statsHelper.statsForPlayer(playerName, false);
	var html = [];
	if (absolutePlayerStats) {
		var headings = Ultimate.statsHelper.getStatLabelLookup();
		var perPointPlayerStats = Ultimate.statsHelper.statsForPlayer(playerName, true);
		addRowToStatsTable(html,'<strong>Statistic</strong>','<strong>Value</strong>','<strong>Per Point Played</strong>');
		addRowToStatsTable(html,'&nbsp;','&nbsp;');
		addRowToStatsTable(html,headings.gamesPlayed,absolutePlayerStats.gamesPlayed);
		addRowToStatsTable(html,headings.pointsPlayed,absolutePlayerStats.pointsPlayed);
		addRowToStatsTable(html,headings.opointsPlayed,absolutePlayerStats.opointsPlayed);
		addRowToStatsTable(html,headings.dpointsPlayed,absolutePlayerStats.dpointsPlayed);
		addRowToStatsTable(html,headings.minutesPlayed,absolutePlayerStats.minutesPlayed);
		addRowToStatsTable(html,headings.touches,absolutePlayerStats.touches, perPointPlayerStats.touches);
		addRowToStatsTable(html,headings.goals,absolutePlayerStats.goals, perPointPlayerStats.goals);
		addRowToStatsTable(html,headings.assists,absolutePlayerStats.assists, perPointPlayerStats.assists);
		addRowToStatsTable(html,headings.passes,absolutePlayerStats.passes, perPointPlayerStats.passes);
		addRowToStatsTable(html,headings.catches,absolutePlayerStats.catches, perPointPlayerStats.catches);
		addRowToStatsTable(html,headings.drops,absolutePlayerStats.drops, perPointPlayerStats.drops);
		addRowToStatsTable(html,headings.throwaways,absolutePlayerStats.throwaways, perPointPlayerStats.throwaways);
		addRowToStatsTable(html,headings.ds,absolutePlayerStats.ds, perPointPlayerStats.ds);
		addRowToStatsTable(html,headings.pulls,absolutePlayerStats.pulls, perPointPlayerStats.pulls);
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

function secondsToMinutes(seconds, decimalPositions) {
	return decimalPositions ? (seconds/60).toFixed(decimalPositions) : Math.round(seconds / 60);
	return decimalPositions ? seconds/60 : Math.round(seconds / 60);
}

function createTeamStatsTableHtml(statsTable) {
	if (Ultimate.teamStatsTemplate == null) {
		Ultimate.teamStatsTemplate = Handlebars.compile($("#playerStatsTableTemplate").html());
	}
	return Ultimate.teamStatsTemplate(statsTable);
}

function isAbsoluteDenominator() {
	return $('#statDenominatorRadioButtons input[@name=statDenominatorType]:checked').attr('value') == 'Absolute';	
}

function getTeamsSelectionChoice() {
	return $('#selectGamesForTeamStats option:selected').val();
}

function isNarrowDevice() {
	return screen.width < 500; // equivalent to media query device-width 
	//return document.documentElement.clientWidth < 500;  // equivalent to media query width 
	//return true;
}
