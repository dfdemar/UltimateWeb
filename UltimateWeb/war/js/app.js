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
	populateTeamName();
	populatePlayersList();
}

function renderGamesPage(data) {
	populateTeamName();
	populateGamesList();
}

function renderGameEventsPage(data) {
	renderGamePageBasics(data)
	populateEventsList();
}

function renderGameStatsPage(data) {
	renderGamePageBasics(data);
	populateGamePlayerStats(data);
}

function renderPlayerStatsPage(data) {
	renderGamePageBasics(data);
	populatePlayerStats(data);
}


function renderGamePageBasics(data) {
	populateTeamName();
	Ultimate.gameId = data.options.pageData.gameId;
	$('.gameStatsChoiceLink').attr('href','#gamestatspage?gameId=' + Ultimate.gameId);
	$('.gameEventsChoiceLink').attr('href', '#eventspage?gameId=' + Ultimate.gameId);
}


$('.pagediv').live('pageinit', function(event, data) {
	registerPageSwipeHandler('teamPage', 'swipeleft', 'games');
	registerPageSwipeHandler('gamesPage', 'swiperight', 'main');
	
	registerPageSwipeHandler('eventsPage', 'swiperight', 'games');
	
});

function registerPageSwipeHandler(pageSource, swipeEvent, pageTarget) {
	$('#' + pageSource).off(swipeEvent).on(swipeEvent, function(event, data) { // off called because need to ensure only one swipe handler
		$.mobile.changePage(pageTarget, {
			transition : 'slide',
			reverse : swipeEvent == 'swiperight'
		});
	});
}

function populateTeamName() {
	if (!Ultimate.teamName) {
		retrieveTeam(Ultimate.teamId, true, function(team) {
			Ultimate.team = team;
			Ultimate.teamName = team.name;
			$('.teamName').html(Ultimate.teamName);
		}) 
	} else {
		$('.teamName').html(Ultimate.teamName);
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
			html[html.length] = player.name;
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
		html[html.length] = '<div class="game-date">';
		html[html.length] = game.date;
		html[html.length] = '&nbsp;&nbsp;';
		html[html.length] = game.time;
		html[html.length] = '</div>';		
		html[html.length] = '<div class="opponent">vs. ';
		html[html.length] = game.opponentName;
		html[html.length] = '</div>';
		html[html.length] = '<div class="tournament">';
		html[html.length] = isBlank(game.tournamentName) ?  '&nbsp;' : 'at ' + game.tournamentName;
		html[html.length] = '</div>';		
		html[html.length] = '<div class="score '; 
		html[html.length] = game.ours > game.theirs ? 'ourlead' : game.theirs > game.ours ? 'theirlead' : ''; 
		html[html.length] = '">';
		html[html.length] = game.ours;
		html[html.length] = '-';
		html[html.length] = game.theirs;
		html[html.length] = '</div>';
		html[html.length] = '<div class="clear">';
		html[html.length] = '<a></li>';
	}
	$("#games").empty().append(html.join('')).listview("refresh");
}

function isBlank(s) {
	return s == null || s == '';
}

function populateEventsList() {
	retrieveGame(Ultimate.teamId, Ultimate.gameId, function(game) {
		Ultimate.game = game;
		updateGameEventsList(Ultimate.game);
		populateGameTitle();
	}) 
}

function populateGamePlayerStats(data) {
	retrieveGame(Ultimate.teamId, Ultimate.gameId, function(game) {
		Ultimate.game = game;
		populateGameTitle();
		retrievePlayerStatsForGames(Ultimate.teamId, [Ultimate.gameId], function(playerStats) {
			Ultimate.playerStats = playerStats;
			updatePlayerRankingsTable(data.options.pageData.ranktype);
			$('#selectPlayerRank').unbind('change').on('change', function() {
				//$.mobile.changePage('#gamestatspage?gameId=' + Ultimate.gameId + '&ranktype=' + $(this).val());
				updatePlayerRankingsTable($(this).val());
			})
		}) 
	}) 
}

function populatePlayerStats(data, gamesToIncludeType) {
	Ultimate.playerName = data.options.pageData.name;
	var includeType = gamesToIncludeType == null ? 'LastGame' : gamesToIncludeType;
	var retrieveFunctions = {
			'LastGame': retrievePlayerStatsForLastGame,
			'AllGames': retrievePlayerStatsForAllGames,
			'LastTournament': retrievePlayerStatsForLastTournament
			}
	var retrieveFn = retrieveFunctions[includeType];
	retrieveFn(Ultimate.teamId, function(playerStatsArray) {
		$('#selectGamesForPlayerStats').val(includeType);
		$('#statsPlayerNameHeading').html(Ultimate.playerName);
		updatePlayerStatsTable(statsForPlayer(playerStatsArray, Ultimate.playerName));
		$('#selectGamesForPlayerStats').unbind('change').on('change', function() {
			populatePlayerStats(data, $(this).val());
		})
	}); 
}

function populateGameTitle() {
	var game = Ultimate.game;
	$('.opponentTitle').html('vs. ' + game.opponentName);
	var $score = $('.gameScore');
	$score.html(game.ours + '-' + game.theirs);
	$score.addClass(game.ours > game.theirs ? 'ourlead' : game.theirs > game.ours ? 'theirlead' : '');
	$('.gameDetails').html(game.date + ' ' + game.time + (isBlank(game.tournamentName) ?  '' : ' at ' + game.tournamentName));
}

function updateGameEventsList(game) {
	Ultimate.points = JSON.parse(game.pointsJson).reverse();
	var html = [];
	for ( var i = 0; i < Ultimate.points.length; i++) {
		var point = Ultimate.points[i];
		var score = point.summary.score;
		html[html.length] = '<div data-role="collapsible" data-index="';
		html[html.length] = i;
		html[html.length] = '"><h3>';
		html[html.length] = score.ours;
		html[html.length] = '-';
		html[html.length] = score.theirs;
		html[html.length] = point.summary.finished ? '' : ' (unfinished point)';
		html[html.length] = '&nbsp&nbsp';
		html[html.length] = point.summary.lineType == 'O' ? 'O-line' : 'D-line';
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
	$('#selectPlayerRank').val(rankingType);
	var rankings = playerRankingsFor(rankingType);
	var html = [];
	var statDescription = $("#selectPlayerRank :selected").text();
	addRowToStatsTable(html,'<strong>Player</strong>','<strong>' + statDescription + '</strong>');
	addRowToStatsTable(html,'&nbsp;','&nbsp;');
	var total = 0;
	for (var i = 0; i < rankings.length; i++) {
		total += rankings[i].value;
		addRowToStatsTable(html,rankings[i].playerName, rankings[i].value);
	}
	addRowToStatsTable(html,'&nbsp;','&nbsp;');
	addRowToStatsTable(html,'<strong>Total</strong>', '<strong>' + total + '</strong>');
	$('#playerRankings tbody').html(html.join(''));
}

function addRowToStatsTable(html, name, stat) {
	html[html.length] = '<tr><td class="statsTableDescriptionColumn">';
	html[html.length] = name;
	html[html.length] = '</td><td class="statsTableValueColumn">';
	html[html.length] = stat;
	html[html.length] = '</td></tr>';
}

function updatePlayerStatsTable(playerStats) {
	var html = [];
	var statDescription = playerStats.playerName + " stat for " + $("#selectGamesForPlayerStats :selected").text();;
	addRowToStatsTable(html,'<strong>' + statDescription + '</strong>','<strong>Value</strong>');
	addRowToStatsTable(html,'&nbsp;','&nbsp;');
	addRowToStatsTable(html,'Games played',playerStats.gamesPlayed);
	addRowToStatsTable(html,'Points played',playerStats.pointsPlayed);
	addRowToStatsTable(html,'O-line pts played',playerStats.opointsPlayed);
	addRowToStatsTable(html,'D-line pts played',playerStats.dpointsPlayed);
	addRowToStatsTable(html,'Goals',playerStats.goals);
	addRowToStatsTable(html,'Assists',playerStats.assists);
	addRowToStatsTable(html,'Throws',playerStats.passes);
	addRowToStatsTable(html,'Catches',playerStats.catches);
	addRowToStatsTable(html,'Drops',playerStats.drops);
	addRowToStatsTable(html,'Throwaways',playerStats.throwaways);
	addRowToStatsTable(html,'Ds',playerStats.ds);
	addRowToStatsTable(html,'Pulls',playerStats.pulls);

	$('#playerStats tbody').html(html.join(''));
}

function populatePointEvents($pointEl) {
	var point = Ultimate.points[$pointEl.data('index')];
	var events = point.events.reverse();
	var html = [];
	for ( var i = 0; i < events.length; i++) {
		var event = events[i];
		var description = eventDescription(event);
		html[html.length] = '<li>';
		html[html.length] = '<img src="/images/' + description.image + '" class="actionImage">&nbsp;&nbsp;';
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