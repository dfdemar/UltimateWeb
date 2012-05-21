Ultimate.busyDialogStack = 0;
Ultimate.baseRestUrl = "/rest/view";

function retrieveTeam(id, includePlayers, successFunction, errorFunction) {
	var url = Ultimate.baseRestUrl + '/team/' + id;
	url = includePlayers ? url + "?players=true" : url;
	sendRequest({url: url, dataType: 'json', success: successFunction, error: errorFunction});
}

function retrieveGames(teamId, successFunction, errorFunction) {
	var url = Ultimate.baseRestUrl + '/team/' + teamId + '/games'; 
	sendRequest({url: url, dataType: 'json', success: successFunction, error: errorFunction});
}

function retrieveGame(teamId, gameId, successFunction, errorFunction) {
	var url = Ultimate.baseRestUrl + '/team/' + teamId + '/game/' + gameId; 
	sendRequest({url: url, dataType: 'json', success: successFunction, error: errorFunction});
}

function deleteGame(teamId, gameId, successFunction, errorFunction) {
	var url = Ultimate.baseRestUrl + '/team/' + teamId + '/game/' + gameId + '/delete'; 
	sendRequest({url: url, dataType: 'json', isPost: true, success: successFunction, error: errorFunction});
}

function deleteTeam(teamId, successFunction, errorFunction) {
	var url = Ultimate.baseRestUrl + '/team/' + teamId + '/delete'; 
	sendRequest({url: url, dataType: 'json', isPost: true, success: successFunction, error: errorFunction});
}

function retrievePlayerStatsForGames(teamId, gameIds, successFunction, errorFunction) {
	var url = Ultimate.baseRestUrl + '/team/' + teamId + '/stats/player';   
	sendRequest({url: url, dataType: 'json', isPost: true, data: JSON.stringify(gameIds), success: successFunction, error: errorFunction});
}

function retrieveTeamStatsForGames(teamId, gameIds, successFunction, errorFunction) {
    var url = Ultimate.baseRestUrl + '/team/' + teamId + '/stats/team';
    sendRequest({url: url, dataType: 'json', isPost: true, data: JSON.stringify(gameIds), success: successFunction, error: errorFunction});
}

function retrieveTeams(successFunction, errorFunction) {
	var url = Ultimate.baseRestUrl + '/teams'; 
	sendRequest({url: url, dataType: 'json', success: successFunction, error: errorFunction});
}

function retrievePlayerStatsForGame(options, successFunction, errorFunction) {
	var teamId = options.teamId;
	retrievePlayerStatsForGames(teamId, [options.gameId], successFunction, errorFunction);
}

function sendRequest(request) {
	var options = {
    	cache: false, 
	  	success: function(data, textStatus, jqXHR){
	  		busyDialogEnd();
	  		var responseTypeReceived = jqXHR.getResponseHeader('Content-Type'); 
	  		if (isExpectedResponseType(request, jqXHR)) {
	  			request.success(data, textStatus, jqXHR);
	  		} else {
	  			logRequestFailure(jqXHR, "", "unexpected response type = " + responseTypeReceived);
	  		}
		}, 
		error: function(jqXHR, textStatus, errorThrown){
			busyDialogEnd();
			var error = logRequestFailure(jqXHR, textStatus, errorThrown);
			if (request.error) {
				request.error(jqXHR, textStatus, errorThrown);
			} else {
				throw error;
			} 
		}
	};
	if (request.dataType) {
		options.dataType = request.dataType;
	}
	if (request.isPost) {
		options.type = 'POST';
		options.contentType = 'application/json';
	}
	if (request.data) {
		options.data = request.data;
	}
	busyDialogStart();
    $.ajax(request.url, options);
}

function isExpectedResponseType(request, responseTypeReceived) {
	if (request.expectedResponseType) {
		if (responseTypeReceived.indexOf(request.expectedResponseType) < 0) {
			return false;
		}
	}
	return true;
}

function addCommas(nStr)
{
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

function logRequestFailure(jqXHR, textStatus, errorThrow) {
    var error = errorDescription(jqXHR, textStatus, errorThrow);
    logError(error);
    return error;
}

function errorDescription(jqXHR, textStatus, errorThrow) {
    return 'ERROR: status '  + jqXHR.status + ' ('  + textStatus  + ') '  + errorThrow +
        (jqXHR.responseText ? ' \n'  + jqXHR.responseText : '');
}

function getParameterByName(name) {
	var parts = window.location.href.split('?');  // jQM seems to pass odd urls sometimes (previous qs before current qs)
	var queryString = '?' + parts[parts.length -1];
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(queryString);
    var value = match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    return value;
}

function logError(error) {
	if (window.console) {
		console.log(error);
	} 
}

// descending date-ordered list
function sortGames(games) {
	var sortedGames = games.sort(function(a,b) { 
		var first = a.msSinceEpoch ? a.msSinceEpoch : 0;
		var second = b.msSinceEpoch ? b.msSinceEpoch : 0;
		return second - first;
	});
	return sortedGames;
}

//answer an array of object: {id: 'TOURNAMENT-Centex-2012', name: 'Centex', year: 2012, games:['game1234', 'game345']} in reverse chrono order
function getTournaments(games) {
	var tournamentsList = [];
	if (games && games.length > 0) {
		var sortedGames = sortGames(games);
		var tournamentGames = {};

		jQuery.each(sortedGames, function() {
			var name = this.tournamentName;
			if (name) {
				var year = this.msSinceEpoch ? new Date(this.msSinceEpoch).getFullYear() : '';
				var id = 'TOURNAMENT-' + name + '-' + year;
				if (!tournamentGames[id]) {
					tournamentGames[id] = [];
					tournamentsList.push({id: id, name: name, year: year});
				}
				tournamentGames[id].push(this.gameId);
			}
		});
		
		jQuery.each(tournamentsList, function() {
			this.games = tournamentGames[this.id];
		});
		
		return tournamentsList;
	} 
	return [];
}

function getInternetExplorerVersion()
// Returns the version of Internet Explorer or a -1 (indicating the use of another browser).
{
	var rv = -1; // Return value assumes failure.
	if (navigator.appName == 'Microsoft Internet Explorer') {
		var ua = navigator.userAgent;
		var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
			rv = parseFloat(RegExp.$1);
	}
	return rv;
}

function log(message) {
	if (window.console) {
		console.log(message);
	}
}

function isNullOrEmpty(s) {
	return s == null || jQuery.trim(s) == '';
}

function busyDialogStart() {
	Ultimate.busyDialogStack++;
	if (Ultimate.busyDialogStack == 1) {
		$('.hideWhenBusy').addClass('hidden');
		$('.spinner').removeClass('hidden');
	}
}

function busyDialogEnd() {
	Ultimate.busyDialogStack--;
	if (Ultimate.busyDialogStack == 0) {
		resetBusyDialog();
	}
}

function resetBusyDialog() {
	$('.spinner').addClass('hidden');
	$('.hideWhenBusy').removeClass('hidden');
	Ultimate.busyDialogStack == 0;
}

/*
Creates a canonical string representation of the object which can be used for comparison or subsequent hash creation.  
The object will be deeply recursed to find all objects. 
Circular references are handled automatically (an object will not be re-visited once it has been handled).
Thread-safe (designed to be a singleton)
*/
Ultimate.Canonicalizer = function () {
    /*
    Return a canonical string of the object.
    Undefined properties are skipped.
    options: {  
    treatNullAsUndefined: boolean  By default NULL properties will be written.  To treat nulls like undefined specify treatNullAsUndefined
    treatEmptyStringsAsUndefined: boolean  By default empty string properties will be written.  To treat empty strings like undefined specify treatEmptyStringsAsUndefined
    <propertyName>: boolean   By default all other properties of an object are navigated.  To ignore a certain property add it to the options with value of true. 
    */
    this.toCanonicalString = function (object, options) {
        var allProps = [];
        var visitedObjects = [];
        pushObject(object, allProps, options, 0, visitedObjects);
        return allProps.join("");
    };

    function pushObject(obj, allProps, options, level, visitedObjects) {
        if (typeof obj == 'object' && obj != null) {
            var visitedReference = getVisitedReference(obj, visitedObjects);
            if (visitedReference) {
                allProps[allProps.length] = visitedReference;
            } else {
                visitedObjects.push(obj);
                var props = [];
                for (var prop in obj) {
                    props.push(prop);
                }
                props = props.sort();
                for (var i = 0; i < props.length; i++) {
                    var childObj = obj[props[i]];
                    if (shouldPush(childObj, options, props[i])) {
                        allProps[allProps.length] = '\n';
                        for (var j = 0; j < level; j++) {
                            allProps[allProps.length] = '.';
                        }
                        allProps[allProps.length] = props[i];
                        allProps[allProps.length] = ':';
                        pushObject(childObj, allProps, options, level + 1, visitedObjects);
                    }
                }
            }
        } else {
            allProps[allProps.length] = obj == null ? 'null' : obj;
        }
    }

    function shouldPush(value, options, propName) {
        if (propName && options[propName]) {
            return false;
        } else if (typeof value == 'function' || value === undefined) {
            return false;
        } else if (options.treatNullAsUndefined && value === null) {
            return false;
        } else if (options.treatEmptyStringsAsUndefined && value == '') {
            return false;
        }
        return true;
    }

    function getVisitedReference(object, visitedObjects) {
        for (var i = 0; i < visitedObjects.length; i++) {
            if (visitedObjects[i] === object) {
                return '@REF' + i;
            }
        }
        return null;
    }

};
