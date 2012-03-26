var ieVersion = getInternetExplorerVersion();
if (ieVersion > 5 && ieVersion < 9) {
	alert("Ewww. We see you are using a version of Internet Explorer prior to version 9 (or running your new version in compatibility mode).  This application hasn't been tested on this browser.  We recommend Chrome, Firefox, Safari or Internet Explorer 9 or above.  You can also use this site on most mobile web browsers.")
}

$(document).live('pagechange', function(event, data) {
	$('.logout').attr('href', Ultimate.logoutUrl);
	var toPageId = data.toPage.attr("id");
	switch (toPageId) {
		case 'mainpage':
			renderMainPage(data);
			break;
		case 'gamespage':
			renderGamesPage(data);
			break;	
		case 'confirmDeleteDialog':
			renderConfirmDeleteDialog(data);
			break;				
		default:
			//
	}
});

function renderMainPage(data) {
	$('.adminUser').html(Ultimate.userName);
	populateTeamsList();
}

function renderGamesPage(data) {
	Ultimate.teamId = data.options.pageData.team;
	populateTeam(function() {
		populateGamesList();
	});
}

function renderGamePageBasics(data) {
	Ultimate.gameId = data.options.pageData.gameId;
	$('.gameStatsChoiceLink').attr('href','#gamestatspage?gameId=' + Ultimate.gameId);
	$('.gameEventsChoiceLink').attr('href', '#eventspage?gameId=' + Ultimate.gameId);
}

function renderConfirmDeleteDialog(data) {
	$('#deleteDescription').html(Ultimate.itemToDeleteDescription);
	$('#deleteConfirmedButton').unbind().on('click', function() {
			Ultimate.deleteConfirmedFn();
		});
}

function populateTeamsList(successFunction) {
	retrieveTeams(function(teams) {
		Ultimate.teams = teams;
		updateTeamsList(Ultimate.teams);
		if (successFunction) {
			successFunction();
		}
	},handleRestError);
}

function updateTeamsList(teams) {
		var html = [];
		for ( var i = 0; i < teams.length; i++) {
			var team = teams[i];
			html[html.length] = '<li><a href="#gamespage?team=';
			html[html.length] = team.cloudId;
			html[html.length] = '"><img class="teamDeleteButton"src="/images/delete.png" data-teamname="';
			html[html.length] = team.name + ' (team ID ' + team.cloudId + ')';
			html[html.length] = '" data-teamid="';
			html[html.length] = team.cloudId;
			html[html.length] = '" />'
			html[html.length] = team.name;
			html[html.length] = ' (team ID = ';
			html[html.length] = team.cloudId;
			html[html.length] = ')</a></li>';
		}
		$("#teams").empty().append(html.join('')).listview("refresh");
		$('.teamDeleteButton').unbind().on('click', function() {
			$deleteButton = $(this);
			Ultimate.itemToDeleteDescription = $deleteButton.data('teamname');
			Ultimate.itemToDeleteId = $deleteButton.data('teamid');
			Ultimate.deleteConfirmedFn = function() {
				deleteTeam(Ultimate.itemToDeleteId, function() {
					$.mobile.changePage('#mainpage', {transition: 'pop'});
				},handleRestError);
			};
			$.mobile.changePage('#confirmDeleteDialog', {transition: 'pop', role: 'dialog'});   
			
			return false;
		})
}

function populateTeam(successFunction) {
	retrieveTeam(Ultimate.teamId, false, function(team) {
		Ultimate.team = team;
		Ultimate.teamName = team.name;
		if (successFunction) {
			successFunction();
		}
	});
}

function populateGamesList() {
	retrieveGames(Ultimate.teamId, function(games) {
		Ultimate.games = games;
		updateGamesList(Ultimate.games);
		$('.gameDeleteButton').unbind().on('click', function() {
			$deleteButton = $(this);
			Ultimate.itemToDeleteDescription = 'game ' + decodeURIComponent($deleteButton.data('description'));
			Ultimate.itemToDeleteId = $deleteButton.data('game');
			Ultimate.deleteConfirmedFn = function() {
				deleteGame(Ultimate.teamId, Ultimate.itemToDeleteId, function() {
					$.mobile.changePage('#gamespage?team=' + Ultimate.teamId, {transition: 'pop'});
				},handleRestError);
			};
			$.mobile.changePage('#confirmDeleteDialog', {transition: 'pop', role: 'dialog'});   
		})
	}) 
}

function updateGamesList(games) {
	var sortedGames = sortGames(games);
	var html = [];
	for ( var i = 0; i < sortedGames.length; i++) {
		var game = sortedGames[i];
		var shortGameDesc = game.date + ' ' + game.time + ' vs. ' + game.opponentName;
		html[html.length] = '<li>';
		html[html.length] = '<img src="/images/delete.png" class="listImage gameDeleteButton" data-game="';
        html[html.length] =  game.gameId;
		html[html.length] = '" data-description="';
        html[html.length] = encodeURIComponent(shortGameDesc);       
		html[html.length] = '"><span class="game-date">';
		html[html.length] = game.date;
		html[html.length] = '&nbsp;&nbsp;';
		html[html.length] = game.time;
		html[html.length] = '</span>&nbsp;&nbsp;';		
		html[html.length] = '<span class="opponent">vs. ';
		html[html.length] = game.opponentName;
		html[html.length] = '</span>';
		html[html.length] = '<span class="tournament">';
		html[html.length] = isNullOrEmpty(game.tournamentName) ?  '&nbsp;&nbsp;&nbsp;' : '&nbsp;&nbsp;at ' + game.tournamentName;
		html[html.length] = '</span>&nbsp;&nbsp;';		
		html[html.length] = '<span class="score '; 
		html[html.length] = game.ours > game.theirs ? 'ourlead' : game.theirs > game.ours ? 'theirlead' : ''; 
		html[html.length] = '">';
		html[html.length] = game.ours;
		html[html.length] = '-';
		html[html.length] = game.theirs;
		html[html.length] = '</span>';
		html[html.length] = '</li>';
	}
	var teamTitle = Ultimate.teamName + (sortedGames.length > 0 ? ' games' : ' (no games for this team)');
	$('.teamTitle').html(teamTitle);
	var $websiteLink = $('#teamWebsite');
	$websiteLink.attr('href', $websiteLink.attr('href').replace('{TEAMID}', Ultimate.teamId));
	$("#games").empty().append(html.join('')).listview("refresh");
}

function handleRestError(jqXHR, textStatus, errorThrown) {
	if (jqXHR.status = 401) {
		location.href = Ultimate.logonUrl;
	} else {
		throw errorDescription(jqXHR, textStatus, errorThrown);
	}
}
