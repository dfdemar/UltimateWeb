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
{"id": 5724681378201600, "name": "Dragons", location: "Rochester"},
{"id":5131065358286848, "name": "Rush", location: "Toronto"},
{"id": 5153656886263808, "name": "Phoenix", location: "Philadelphia"},
{"id": 5753341694967808, "name": "Royal", location: "Montreal"},
{"id": 6597766625099776, "name": "Spiders", location: "San Jose"},
{"id": 5648334039547904, "name": "Raptors", location: "Seattle"},
{"id": 6226234774126592, "name": "Riptide", location: "Vancouver"},
{"id": 5716606839685120, "name": "Lions", location: "Salt Lake"},
{"id": 5094953273262080, "name": "FlameThrowers", location: "San Francisco"}
]).sortBy('location').valueOf();

var allTeamNamesPromise = $.ajax('http://www.ultianalytics.com/rest/view/teams/all');
var recentGamesPromise = $.ajax('http://www.ultianalytics.com/rest/view/games?days=14');

recentGamesPromise.then(function(recentGames){
  appendRecentGames(recentGames);
  allTeamNamesPromise.then(function(teamNames){
    establishSearch(teamNames, recentGames);
  });
});
var teamNodes = '';
_.each(teamsJson, function(team){
  teamNodes += '<li><a href="http://www.ultianalytics.com/app/index.html#/'+team.id+'/players">'+team.location+ ' ' +team.name+'</a></li>'
});
$('.audl-teams').append(teamNodes)
function establishSearch(teamNames, recentGames){
  var teamSearch = searchify(teamNames, 'name');
  var gameSearch = searchify(recentGames, 'opponentName');

  $searchInput = $('#search');
  $searchInput.on('keydown', _.debounce(function(event){
    $dropdown = $('.search-results');
    teardown($dropdown);

    // click away -> close dropdown
    $(window).on('click', function(){ teardown($dropdown); });

    teamResults = search(teamSearch, $searchInput.val().toLowerCase());
    if (teamResults.length){
      var teamsToAppend = '';
      _.each(teamResults, function(team){
        teamsToAppend += teamDropdownItem(team.cloudId, team.passwordProtected, team.name, team.numberOfGames);
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
  recentGames.sort(function(a,b){
    return (new Date(a.lastUpdateUtc) - new Date(b.lastUpdateUtc))
  })
  var l = recentGames.length - 1;
  for (var i = 0; i < 15; i++){
    $('.teams').append(recentGame(recentGames[l-i]));
  }
}
function recentGame(game){
  var badDate = new Date(game.lastUpdateUtc);
  var timezoneOffset = (new Date()).getTimezoneOffset();
  goodDate = badDate.setMinutes(-timezoneOffset);
  timeSinceString = getTimeString(goodDate);
  return '<tr><td><a href="http://www.ultianalytics.com/app/index.html#/'+game.teamId+'/games?'+game.gameId+'">' + game.teamInfo.name + ' vs. ' + game.opponentName + '</a></td><td>'+ game.ours + ' - ' + game.theirs + '</td><td>'+ timeSinceString + ' ago</td></tr>';
}
function gameDropdownItem(cloudId,isPasswordProtected,teamName, opponentName){
  return '<li><a class="search-option" href="http://www.ultianalytics.com/app/index.html#/'+cloudId+'/players">'+ teamName + ' vs ' + opponentName + (isPasswordProtected ? '<i class="icon-lock lock-icon"></i>' : '') + '</a></li>';
}
function teamDropdownItem(cloudId,isPasswordProtected,name, gamesPlayed){
  return '<li><a class="search-option" href="http://www.ultianalytics.com/app/index.html#/'+cloudId+'/players">'+ name + '<span class="games-played">('+ gamesPlayed +' games)</span>' +(isPasswordProtected ? '<i class="icon-lock lock-icon"></i>' : '') + '</a></li>';
}
function teardown($node){
  $node.empty()
  $node.hide()
}
function search(tree, token){
  var results = prefixSearch(tree, token).slice(0, 8);
  return results.concat(simpleSearch(8 - results.length));
}
function prefixSearch(tree, token){
  if (!token) {return tree.children || []; }
  if (!tree[token[0]]) {return []; }
  return prefixSearch(tree[token[0]], token.slice(1));
}
function getTimeString(gameMs){
  var minutes = Math.floor(((new Date()).getTime() - gameMs) / 60000);
  var hours = Math.floor(minutes / 60);
  var days = Math.floor(hours / 24);
  if (days) return days + ' days';
  if (hours) return hours + ' hours';
  if (minutes) return minutes + ' minutes';
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
function simpleSearch(teams,numberNeeded){
  var i = 0;
  var found = [];
  while (found.length < numberNeeded && i < teams.length){
    if (_(teams[i].name).contains(item)){
      found.push(teams[i])
    }
  }
  return found
}
