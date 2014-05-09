var ieVersion = getInternetExplorerVersion();
if (ieVersion > 5 && ieVersion < 9) {
	alert("Ewww. We see you are using a version of Internet Explorer prior to version 9 (or running your new version in compatibility mode).  This application hasn't been tested on this browser.  We recommend Chrome, Firefox, Safari or Internet Explorer 9 or above.  You can also use this site on most mobile web browsers.")
}

$(document).live('pagechange', function(event, data) {
	renderAppLink();
	$('.logout').attr('href', Ultimate.logoutUrl);
	switch (getCurrentPageId()) {
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
		case 'importGameDialog':
			renderImportGameDialog(data);
			break;			
		case 'teamPasswordDialog':
			renderTeamPasswordDialog(data);
			break;		
		case 'playerChangeDialog':
			renderPlayerChangeDialog(data);
			break;			
		default:
			//
	}
});

function getCurrentPageId() {
	return $.mobile.activePage.attr('id');
}

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
	$('.importGameLink').unbind().on('click', function() {
		handleImportGameClicked();
	});
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

function renderImportGameDialog(data) {
	$('.importGameForm').attr('action', urlForGameExportFileUpload(Ultimate.team.cloudId));
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

function renderPlayerChangeDialog(data) {
	var team = Ultimate.team;
	var player = data.options.pageData.player;
	var change = data.options.pageData.change;
	if (change == 'merge') {
		renderDeletePlayerDialog(team, player, true);
	} else if (change == 'delete') {
		renderDeletePlayerDialog(team, player, false);
	} else if (change == 'rename') {
		renderRenamePlayerDialog(team, player);
	}
}

function renderDeletePlayerDialog(team, player, isMerge) {
	if (isMerge) {
		configurePlayerMoveDialogForMerge(player);
	} else {
		configurePlayerMoveDialogForDelete(player);
	}
	$('.player-change-dialog-player').html(player);
	$('#moveToPlayerList').html(createMoveToPlayerListHtml(team)).selectmenu('refresh');
	$('#player-change-dialog-doit-button').unbind().on('click', function() {
		var toPlayer = $('#moveToPlayerList option:selected').val();
		deletePlayer(Ultimate.teamId, player, toPlayer, function() {
			alert('Player ' + player + ' deleted.  Associated data moved to player ' + toPlayer + 
					". If you still have games on your mobile device with player " + player + 
					" you should now download those games to your device (otherwise " 
					+ player + " will re-appear when you next upload those games).");
			resetCacheBuster();
			populateTeam(function() {
				$.mobile.changePage('#teamplayerspage?team=' + Ultimate.teamId, {transition: 'pop'});
			}, handleRestError);
		})
	});
}

function renderRenamePlayerDialog(team, player) {
	configurePlayerMoveDialogForRename(player);
	$('.player-change-dialog-player').html(player);
	$('#moveToPlayerList').html(createMoveToPlayerListHtml(team)).selectmenu('refresh');
	$('#player-change-dialog-doit-button').unbind().on('click', function() {
		var newName = $('#player-change-dialog-player-new-name-field').val();
		newName = newName == null ? '' : jQuery.trim(newName);
		if (newName == '' || newName.toLowerCase() == 'anonymous' || newName.toLowerCase() == 'anon' || newName.toLowerCase() == 'unknown' ) {
			alert('Invalid player name');
		} else {
			renamePlayer(Ultimate.teamId, player, newName, function() {
				alert('Player ' + player + ' renamed to ' + newName +
						". If you still have games on your mobile device with player " + player + 
						" you should now download those games to your device (otherwise " 
						+ player + " will re-appear when you next upload those games).");
				resetCacheBuster();
				populateTeam(function() {
					$.mobile.changePage('#teamplayerspage?team=' + Ultimate.teamId, {transition: 'pop'});
				}, handleRestError);
			})
		}
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
		html[html.length] = '">';
		html[html.length] = '<span class="gameActionLink"><a class="gameExportLink" href="javascript:void(0)" data-role="button" data-game="';
        html[html.length] =  game.gameId;
		html[html.length] = '">Export</a></span>';		
		html[html.length] = '<span class="game-date">';
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
	$(".gameExportLink").on('click', function() {
		var gameId = $(this).data('game');
		location.href = urlForGameExportFileDownload(Ultimate.teamId,gameId);
	});
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

function handleImportGameClicked() {
	$.mobile.changePage('#importGameDialog', {transition: 'pop', role: 'dialog'}); 
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

function configurePlayerMoveDialogForDelete(player) {
	$('#player-change-dialog-title').html("Delete Player");
	$('#player-change-dialog-action-description').html("Delete");
	$('#player-change-dialog-instructions').html("When you delete this player the events associated with him/her must be moved to " +
			"another player (or Anonymous).  Choose the other player to whom the events should be moved and then click Delete.");
	$('#player-change-dialog-target-select-label').html("Select player to receive deleted player's events: ");
	$('#player-change-dialog-doit-button .ui-btn-text').html("Delete");
	$('#player-change-dialog-instructions').show();
	$('#player-change-dialog-target-select').show();
	$('#player-change-dialog-player-new-name').hide();
}

function configurePlayerMoveDialogForMerge(player) {
	$('#player-change-dialog-title').html("Merge Player");
	$('#player-change-dialog-action-description').html("Merge player data from");
	$('#player-change-dialog-instructions').html('You are choosing to move all of ' + player + '&apos;s data to another player. ' +
			player + ' will be deleted when complete.  Choose the other player to whom the data should be moved and then click Merge.');
	$('#player-change-dialog-target-select-label').html('Select player to receive ' + player + '&apos;s data: ');
	$('#player-change-dialog-doit-button .ui-btn-text').html("Merge");
	$('#player-change-dialog-instructions').show();
	$('#player-change-dialog-target-select').show();
	$('#player-change-dialog-player-new-name').hide();
}

function configurePlayerMoveDialogForRename(player) {
	$('#player-change-dialog-title').html("Rename Player");
	$('#player-change-dialog-action-description').html("Rename");
	$('#player-change-dialog-doit-button .ui-btn-text').html("Rename");
	$('#player-change-dialog-instructions').hide();
	$('#player-change-dialog-target-select').hide();
	$('#player-change-dialog-player-new-name').show();
}