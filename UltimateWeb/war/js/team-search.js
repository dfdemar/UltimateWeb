
// team search
var teamsJson =_([
{"id": 5182111044599808, "name": "Radicals", location: "Madison"},
{"id": 5638404075159552, "name": "Wind Chill", location: "Minnesota"},
{"id": 6220853180104704, "name": "Empire", location: "New York"},
{"id": 4868028676177920, "name": "Breeze", location: "DC"},
{"id": 5732910535540736, "name": "Revolution", location: "Cincinnati"},
{"id": 5471866718257152, "name": "Wildfire", location: "Chicago"},
{"id": 5684961520648192, "name": "Mechanix", location: "Detroit"},
{"id": 5075454121738240, "name": "AlleyCats", location: "Indianapolis"},
{"id": 5682238511382528, "name": "Dragons", location: "Rochester"},
{"id": 5131065358286848, "name": "Rush", location: "Toronto"},
{"id": 5663684521099264, "name": "Phoenix", location: "Philadelphia"},
{"id": 5753341694967808, "name": "Royal", location: "Montreal"},
{"id": 6597766625099776, "name": "Spiders", location: "San Jose"},
{"id": 5648334039547904, "name": "Raptors", location: "Seattle"},
{"id": 6226234774126592, "name": "Riptide", location: "Vancouver"},
{"id": 5662069344960512, "name": "Lions", location: "Salt Lake"},
{"id": 5094953273262080, "name": "FlameThrowers", location: "San Francisco"}
]).sortBy('location').valueOf();

var recentDays = 14;
var recentDaysPreferred = 7;
var numberOfRecentGamesToDisplay = 20;
var allTeamNamesPromise = $.ajax('http://www.ultianalytics.com/rest/view/teams/all');
var recentGamesPromise = $.ajax('http://www.ultianalytics.com/rest/view/games?days=' + recentDays + '&max=100');
var rootAppHref = "http://www.ultianalytics.com/app/#/"

recentGamesPromise.then(function(recentGames){
  appendRecentGames(recentGames);
  allTeamNamesPromise.then(function(teams){
    establishSearch(teams, recentGames);
  });
});
var teamNodes = '';
_.each(teamsJson, function(team){
  teamNodes += '<li><a href="'+rootAppHref+team.id+'/players">'+team.location+ ' ' +team.name+'</a></li>'
});
$('.audl-teams').append(teamNodes)
function establishSearch(teams, recentGames){
  var teamSearch = searchify(teams, 'name');
  var gameSearch = searchify(recentGames, 'opponentName');

  $searchInput = $('#search');
  $searchInput.on('keydown', _.debounce(function(event){
    $dropdown = $('.search-results');
    teardown($dropdown);

    // click away -> close dropdown
    $(window).on('click', function(){ teardown($dropdown); });

    teamResults = search(teamSearch, $searchInput.val().toLowerCase(), teams);
    if (teamResults.length){
      var teamsToAppend = '';
      _.each(teamResults, function(team){
        teamsToAppend += teamDropdownItem(team.cloudId, team.passwordProtected, team.nameWithSeason, team.numberOfGames);
      });
      dropdownDisplay(teamsToAppend);
    }
    // gameResults = search(gameSearch, $searchInput.val().toLowerCase());
    if (false){ // removed game search for now.
      var gamesToAppend = '<li class="divider"></li>';
      _.each(gameResults, function(game){
        gamesToAppend += gameDropdownItem(game.teamId, game.passwordProtected, game.teamInfo.name, game.opponentName);
      });
      dropdownDisplay(gamesToAppend)
    }
  }, 300));
}
function dropdownDisplay(content){
  $('.search-results').append(content);
  $('.search-results').show();
}
function appendRecentGames(recentGames){
  var mostRecentGames = reduceGames(recentGames);
  mostRecentGames.sort(function(a,b){ // descending
	  if(a.lastUpdateUtc > b.lastUpdateUtc) return -1;
	  if(a.lastUpdateUtc < b.lastUpdateUtc) return 1;
	  return 0;
  })
  var numberOfGames = Math.min(numberOfRecentGamesToDisplay, mostRecentGames.length);
  for (var i = 0; i < numberOfRecentGamesToDisplay; i++){
    $('.teams').append(createRecentGameLink(mostRecentGames[i]));
  }
}
function createRecentGameLink(game){
  var utcDate = parseDateString(game.lastUpdateUtc);
  var timezoneOffsetMinutes = (new Date()).getTimezoneOffset();
  var localDate = new Date(utcDate.getTime() - timezoneOffsetMinutes*60000);
  var timeSinceString = getTimeString(localDate);
  return '<tr><td><a href="'+rootAppHref+game.teamId+'/games?'+game.gameId+'">' + game.teamInfo.name + ' vs. ' + game.opponentName + ', ' + game.date + '</a></td><td>'+ game.ours + ' - ' + game.theirs + '</td><td>'+ timeSinceString + ' ago</td></tr>';
}
function gameDropdownItem(cloudId,isPasswordProtected,teamName, opponentName){
  return '<li><a class="search-option" href="'+rootAppHref+cloudId+'/players">'+ teamName + ' vs ' + opponentName + (isPasswordProtected ? '<i class="icon-lock lock-icon"></i>' : '') + '</a></li>';
}
function teamDropdownItem(cloudId,isPasswordProtected,name, gamesPlayed){
  return '<li><a class="search-option" href="'+rootAppHref+cloudId+'/players">'+ name + '<div class="games-played">('+ gamesPlayed +' games)</div>' +(isPasswordProtected ? '<i class="icon-lock lock-icon"></i>' : '') + '</a></li>';
}
function teardown($node){
  $node.empty()
  $node.hide()
}
function search(tree, token, teams){
  var results = prefixSearch(tree, token).slice(0, 8);
  return results.concat(simpleSearch(teams, 8 - results.length, token));
}
function prefixSearch(tree, token){
  if (!token) {return tree.children || []; }
  if (!tree[token[0]]) {return []; }
  return prefixSearch(tree[token[0]], token.slice(1));
}
function getTimeString(localDate){
  var minutes = Math.floor(((new Date()).getTime() - localDate.getTime()) / 60000);
  var hours = Math.floor(minutes / 60);
  var days = Math.floor(hours / 24);
  if (days) return days + (days == 1 ? ' day' : ' days');
  if (hours) return hours + (hours == 1 ? ' hour' : ' hours');
  if (minutes) return minutes + (minutes == 1 ? ' minute' : ' minutes');
  return " a few seconds";
}
function searchify(teams, indexBy){
  var tree = {}
  _.each(teams, function(team){
    register(team, team[indexBy], tree);
  });
  return tree;
}
function register(team, name, tree){
  if (!name) {return;}
  thisLetter = name[0].toLowerCase();
  if (!tree[thisLetter]) {
    tree[thisLetter] = {children:[]};
  }
  tree[thisLetter].children.push(team);
  register(team, name.slice(1), tree[thisLetter]);
}
function simpleSearch(teams, numberNeeded, searchText){
  var i = 0;
  var found = [];
  if (!_.isEmpty(searchText)) {
    var searchTextLowerCase = searchText.toLowerCase();
    while (found.length < numberNeeded && i < teams.length){
      if (_.contains(teams[i].name.toLowerCase(), searchTextLowerCase)) {
        found.push(teams[i]);
      }
      i++;
    }
  }
  return found
}
function parseDateString(formattedDate) {
	// expects a date formatted as yyyy-mm-dd hh:mm
	var parseableDateString = (formattedDate + ':00').replace(/-/g, '/');  // fix-up the string so that js can parse it
	return new Date(parseableDateString);
}
function reduceGames(recentGames) {
	// try to reduce the games to a smaller set of the most recent (unless we don't have enough)
	var preferredDateRangeBegin = new Date().getTime() - (recentDaysPreferred * 24 * 60 * 60 * 1000);
	var mostRecentGames = _.filter(recentGames, function(game) {
		var gameStartDate = parseDateString(game.timestamp);
		return gameStartDate != null && gameStartDate.getTime() > preferredDateRangeBegin;
	});
	return mostRecentGames.length > numberOfRecentGamesToDisplay ? mostRecentGames : recentGames;
}

