
// team search
var teamsJson2014 =_([
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

var teamsJson2015 =_([
{"id": 5708939920408576, "name": "Hustle", location: "Atlanta"},
{"id": 5643517367943168, "name": "Express", location: "Charlotte"},
{"id": 5671536392404992, "name": "Wildfire", location: "Chicago"},
{"id": 5674069752020992, "name": "Revolution", location: "Cincinnati"},
{"id": 5635093192245248, "name": "Breeze", location: "DC"},
{"id": 5738275486564352, "name": "Mechanix", location: "Detroit"},
{"id": 5724822843686912, "name": "AlleyCats", location: "Indianapolis"},
{"id": 5633494390669312, "name": "Cannons", location: "Jacksonville"},
{"id": 5118639615246336, "name": "Aviators", location: "Los Angeles"},
{"id": 5070544437248000, "name": "Radicals ", location: "Madison"},
{"id": 5683257223938048, "name": "Wind Chill ", location: "Minnesota"},
{"id": 5753050442498048, "name": "Royal", location: "Montreal"},
{"id": 5705718560718848, "name": "Nightwatch", location: "Nashville"},
{"id": 5704221898833920, "name": "Empire", location: "New York"},
{"id": 5751646390845440, "name": "Outlaws ", location: "Ottawa"},
{"id": 5641462360309760, "name": "Phoenix", location: "Philadelphia"},
{"id": 5651757665353728, "name": "Thunderbirds", location: "Pittsburgh"},
{"id": 5684793748488192, "name": "Flyers ", location: "Raleigh"},
{"id": 5670377556541440, "name": "Dragons", location: "Rochester"},
{"id": 5734743547052032, "name": "Growlers", location: "San Diego"},
{"id": 5758048710688768, "name": "FlameThrowers", location: "San Francisco"},
{"id": 5722152447770624, "name": "Spiders", location: "San Jose"},
{"id": 5681589568667648, "name": "Cascades", location: "Seattle"},
{"id": 5754980359208960, "name": "Rush ", location: "Toronto"},
{"id": 5701751084679168, "name": "Riptide", location: "Vancouver"}
]).sortBy('location').valueOf();

var teamsJson2016 =_([
{"id": 5664284977659904, "name": "Hustle", location: "Atlanta"},
{"id": 5128666635829248, "name": "Sol", location: "Austin"},
{"id": 5640136574369792, "name": "Express", location: "Charlotte"},
{"id": 5691616589250560, "name": "Wildfire", location: "Chicago"},
{"id": 5069252692279296, "name": "Revolution", location: "Cincinnati"},
{"id": 5206956054675456, "name": "Roughnecks", location: "Dallas"},
{"id": 5705148370255872, "name": "Breeze", location: "DC"},
{"id": 5769906008096768, "name": "Mechanix", location: "Detroit"},
{"id": 5201331526565888, "name": "AlleyCats", location: "Indianapolis"},
{"id": 5723974822526976, "name": "Cannons", location: "Jacksonville"},
{"id": 4919856549855232, "name": "Aviators", location: "Los Angeles"},
{"id": 5114556594520064, "name": "Radicals ", location: "Madison"},
{"id": 5142198416834560, "name": "Wind Chill ", location: "Minnesota"},
{"id": 5686487861428224, "name": "Royal", location: "Montreal"},
{"id": 5749730717990912, "name": "Nightwatch", location: "Nashville"},
{"id": 5632202645700608, "name": "Empire", location: "New York"},
{"id": 5153306812874752, "name": "Outlaws ", location: "Ottawa"},
{"id": 5675918433452032, "name": "Phoenix", location: "Philadelphia"},
{"id": 5758196635402240, "name": "Thunderbirds", location: "Pittsburgh"},
{"id": 5199033182191616, "name": "Flyers ", location: "Raleigh"},
{"id": 5664810037411840, "name": "Growlers", location: "San Diego"},
{"id": 5743365039587328, "name": "FlameThrowers", location: "San Francisco"},
{"id": 5716256766296064, "name": "Spiders", location: "San Jose"},
{"id": 4860723440123904, "name": "Cascades", location: "Seattle"},
{"id": 5764281479987200, "name": "Rush ", location: "Toronto"},
{"id": 6327231433408512, "name": "Riptide", location: "Vancouver"}
]).sortBy('location').valueOf();

var recentDays = 14;
var recentDaysPreferred = 7;
var numberOfRecentGamesToDisplay = 60;
var allTeamNamesPromise = $.ajax('http://www.ultianalytics.com/rest/view/teams/all');
var recentGamesPromise = $.ajax('http://www.ultianalytics.com/rest/view/games?days=' + recentDays + '&max=100');
var rootAppHref = "http://www.ultianalytics.com/app/#/"

recentGamesPromise.then(function(recentGames){
  appendRecentGames(recentGames);
  allTeamNamesPromise.then(function(teams){
    establishSearch(teams, recentGames);
  });
});

$('.audl-teams').append(createAudlTeamsHtml(teamsJson2016));
$('.audl-teams-2015').append(createAudlTeamsHtml(teamsJson2015));
$('.audl-teams-2014').append(createAudlTeamsHtml(teamsJson2014));

function createAudlTeamsHtml(teams) {
	var teamNodes = '';
	_.each(teams, function(team){
	  teamNodes += '<li><a href="'+rootAppHref+team.id+'/players">'+team.location+ ' ' +team.name+'</a></li>'
	});
	return teamNodes;
}

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
  for (var i = 0; i < numberOfGames; i++){
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
  results = results.concat(simpleSearch(teams, 8 - results.length, token));
  return _.uniq(results, 'cloudId');
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

