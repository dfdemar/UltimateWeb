var ieVersion = getInternetExplorerVersion();
if (ieVersion > 5 && ieVersion < 9) {
	alert("Ewww. We see you are using a version of Internet Explorer prior to version 9 (or running your new version in compatibility mode).  This application hasn't been tested on this browser.  We recommend Chrome, Firefox, Safari or Internet Explorer 9 or above.  You can also use this site on most mobile web browsers.")
}

$(document).live('pagechange', function(event, data) {
	renderAppLink();
	$('.logout').attr('href', Ultimate.logoutUrl);
	var toPageId = data.toPage.attr("id");
	switch (toPageId) {
		case 'mainpage':
			renderMainPage(data);
			break;
		case 'teamsettingspage':
			renderSettingsPage(data);
			break;	
		case 'teamgamespage':
			renderGamesPage(data);
			break;	
		case 'teamplayerspage':
			renderPlayersPage(data);
			break;				
		case 'confirmDeleteDialog':
			renderConfirmDeleteDialog(data);
			break;	
		case 'teamPasswordDialog':
			renderTeamPasswordDialog(data);
			break;		
		case 'playerDeleteDialog':
			renderPlayerDeleteDialog(data);
			break;			
		default:
			//
	}
});

function renderAppLink() {
	var isIOS = (navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i));
	$('.appLink').prop('href', 'iultimate://').toggleClass('hidden', !isIOS);
}


function renderMainPage(data) {
	$('.adminUser').html(Ultimate.userName);
	populateTeamsList();
}

function renderSettingsPage(data) {
	Ultimate.teamId = data.options.pageData.team;
	populateTeam(function() {
		$('.teamPassword').html(Ultimate.team.password == null ? "NOT SET" : Ultimate.team.password);
		$('.teamPassword').unbind().on('click', function() {
			handleSetPasswordClicked();
		});
		registerTeamPageRadioButtonHandler('teamsettingspage');
	}, handleRestError);
}

function renderGamesPage(data) {
	Ultimate.teamId = data.options.pageData.team;
	populateTeam(function() {
		populateGamesList();
		registerTeamPageRadioButtonHandler('teamgamespage');
	}, handleRestError);
}

function renderPlayersPage(data) {
	Ultimate.teamId = data.options.pageData.team;
	populateTeam(function() {
		$('#playersList').html(createPlayerListHtml(Ultimate.team)).listview('refresh');
		registerTeamPageRadioButtonHandler('teamplayerspage');
	}, handleRestError);
}

function renderConfirmDeleteDialog(data) {
	$('#deleteDescription').html(Ultimate.itemToDeleteDescription);
	$('#deleteConfirmedButton').unbind().on('click', function() {
			Ultimate.deleteConfirmedFn();
		});
}

function renderTeamPasswordDialog(data) {
	var team = Ultimate.team;
	$('#passwordSaveErrorMessage').html("");
	$('#teamPasswordInput').val(team.password);
	if (isNullOrEmpty(team.password)) {
		$('#removePasswordButton').css('display', 'none');		
	} else {
		$('#removePasswordButton').css('display', '').unbind().on('click', function() {
			submitPassword(Ultimate.team.cloudId, null);
		});
	}
	$('#savePasswordButton').unbind().on('click', function() {
		var newPwd = $('#teamPasswordInput').val();
		submitPassword(Ultimate.team.cloudId, newPwd);
	});
}

function renderPlayerDeleteDialog(data) {
	var team = Ultimate.team;
	var player = data.options.pageData.player;
	$('#deletePlayerName').html(player);
	$('#moveToPlayerList').html(createMoveToPlayerListHtml(team)).selectmenu('refresh');
	$('#deletePlayerButton').unbind().on('click', function() {
		var toPlayer = $('#moveToPlayerList option:selected').val();
		deletePlayer(Ultimate.teamId, player, toPlayer, function() {
			alert('Player ' + player + ' deleted.  Associated events moved to player ' + toPlayer);
			resetCacheBuster();
			populateTeam(function() {
				$.mobile.changePage('#teamplayerspage?team=' + Ultimate.teamId, {transition: 'pop'});
			}, handleRestError);
		})
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
			html[html.length] = '<li><a href="#teamsettingspage?team=';
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
					resetCacheBuster();
					$.mobile.changePage('#mainpage', {transition: 'pop'});
				},handleRestError);
			};
			$.mobile.changePage('#confirmDeleteDialog', {transition: 'pop', role: 'dialog'});   
			
			return false;
		})
}

function populateTeam(successFunction) {
	retrieveTeamForAdmin(Ultimate.teamId, true, function(team) {
		Ultimate.team = team;
		Ultimate.teamName = team.name;
		var teamTitle = Ultimate.teamName + ', team ID ' + Ultimate.teamId;
		$('.teamTitle').html(teamTitle);
		$('.teamWebsite').attr('href', '/team/' + Ultimate.teamId + '/main');
		if (successFunction) {
			successFunction();
		}
	}, handleRestError);
}

function populateGamesList() {
	retrieveGamesForAdmin(Ultimate.teamId, function(games) {
		Ultimate.games = games;
		updateGamesList(Ultimate.games);
		$('.gameDeleteButton').unbind().on('click', function() {
			$deleteButton = $(this);
			Ultimate.itemToDeleteDescription = 'game ' + decodeURIComponent($deleteButton.data('description'));
			Ultimate.itemToDeleteId = $deleteButton.data('game');
			Ultimate.deleteConfirmedFn = function() {
				deleteGame(Ultimate.teamId, Ultimate.itemToDeleteId, function() {
					$.mobile.changePage('#teamsettingspage?team=' + Ultimate.teamId, {transition: 'pop'});
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
	var gamesTitle = (sortedGames.length > 0 ? ' Games:' : ' (no games for this team)');
	$('.gamesTitle').html(gamesTitle);
	var $websiteLink = $('.teamWebsite');
	$websiteLink.attr('href', $websiteLink.attr('href').replace('{TEAMID}', Ultimate.teamId));
	$("#games").empty().append(html.join('')).listview("refresh");
}

function handleRestError(jqXHR, textStatus, errorThrown) {
	if (jqXHR.status == 401) {
		location.href = Ultimate.logonUrl;
	} else {
		throw errorDescription(jqXHR, textStatus, errorThrown);
	}
}

function handleSetPasswordClicked() {
	$.mobile.changePage('#teamPasswordDialog', {transition: 'pop', role: 'dialog'}); 
}

function submitPassword(teamId, newPwd) {
	savePassword(teamId, newPwd, function() {
		resetCacheBuster();
		$.mobile.changePage('#teamsettingspage?team='+teamId, {transition: 'pop'});
		$(".teamPassword").html(newPwd);
	}, function() {
		$('#passwordSaveErrorMessage').html("Error saving password");
	});
}

function createPlayerListHtml(team) {
	if (Ultimate.playersTemplate == null) {
		Ultimate.playersTemplate = Handlebars.compile($("#playersListTemplate").html());
	}
	return Ultimate.playersTemplate(team);
}

function createMoveToPlayerListHtml(team) {
	if (Ultimate.moveToPlayersTemplate == null) {
		Ultimate.moveToPlayersTemplate = Handlebars.compile($("#moveToPlayerListTemplate").html());
	}
	return Ultimate.moveToPlayersTemplate(team);
}

function registerTeamPageRadioButtonHandler(page) {
	$('.team-view-choice-selector-' + page + ' input').prop('checked', false).checkboxradio("refresh");
	$('#team-view-choice-' + page + '-' + page).prop('checked', true).checkboxradio("refresh");
	$('.team-view-choice-selector-' + page + ' input').unbind('click').on('click', function() {
		var teamPageUrl = $('.team-view-choice-selector-' + page + ' input:checked').attr('value');
		teamPageUrl = '#' + teamPageUrl + '?team=' + Ultimate.teamId;
		$.mobile.changePage(teamPageUrl);
	});
}
