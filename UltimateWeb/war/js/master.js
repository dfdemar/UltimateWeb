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
		default:
			//
	}
});

function renderMainPage(data) {
	$('#copyButton').on('click', function() {
		submitTeamCopyRequest();
	})
}

function submitTeamCopyRequest() {
	var teamIdToCopy = $('#copyteamid').val();
	copyTeam(teamIdToCopy, function() {
		alert("Team Copied");
	}, handleRestError);
}

function handleRestError(jqXHR, textStatus, errorThrown) {
	if (jqXHR.status == 401) {
		location.href = Ultimate.logonUrl;
	} else {
		alert("Error...request not performed (see browser console for details)");
	}
}


function copyTeam(teamId, successFunction, errorFunction) {
	var url = Ultimate.baseRestUrl + '/team/' + teamId + '/supportcopy'; 
	sendRequest({url: url, dataType: 'json', isPost: true, success: successFunction, error: errorFunction});
}