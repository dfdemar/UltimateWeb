		window.ultimateBaseRestQuery = "/rest/view";
		
	    function retrieveTeam(id, includePlayers, successFunction, errorFunction) {
	    	var url = ultimateBaseRestQuery + '/team/' + id;
	    	url = includePlayers ? url + "?players=true" : url;
	    	restQuery({url: url, dataType: 'json', success: successFunction, error: errorFunction});
	    }
	    
	    function retrieveGames(teamId, successFunction, errorFunction) {
	    	var url = ultimateBaseRestQuery + '/team/' + teamId + '/games'; 
	    	restQuery({url: url, dataType: 'json', success: successFunction, error: errorFunction});
	    }
	    
	    function retrieveGame(teamId, gameId, successFunction, errorFunction) {
	    	var url = ultimateBaseRestQuery + '/team/' + teamId + '/game/' + gameId; 
	    	restQuery({url: url, dataType: 'json', success: successFunction, error: errorFunction});
	    }
	    
	    function retrievePlayerStatsForGames(teamId, gameIds, successFunction, errorFunction) {
	    	var url = ultimateBaseRestQuery + '/team/' + teamId + '/stats/player';   
	    	restQuery({url: url, dataType: 'json', isPost: true, data: JSON.stringify(gameIds), success: successFunction, error: errorFunction});
	    }
	    	    
	    function restQuery(request) {
	    	var options = {
	        	cache: false, 
        	  	success: function(data, textStatus, jqXHR){
        	  		var responseTypeReceived = jqXHR.getResponseHeader('Content-Type'); 
        	  		if (isExpectedResponseType(request, jqXHR)) {
        	  			request.success(data, textStatus, jqXHR);
        	  		} else {
        	  			logRequestFailure(jqXHR, "", "unexpected response type = " + responseTypeReceived);
        	  		}
				}, 
				error: function(jqXHR, textStatus, errorThrown){
						logRequestFailure(jqXHR, textStatus, errorThrown);
						if (request.error) {
							request.error(jqXHR, textStatus, errorThrown);
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
	        var error = 'ERROR: status '  + jqXHR.status + ' ('  + textStatus  + ') '  + errorThrow +
	            (jqXHR.responseText ? ' \n'  + jqXHR.responseText : '');
	        logError(error);
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
	    	throw error;
	    }

	    
