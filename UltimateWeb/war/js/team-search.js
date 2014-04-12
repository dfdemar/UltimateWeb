
$.ajax('http://www.ultianalytics.com/rest/view/teams/all').then(function(response){
  var tree = searchify(response);
  $searchInput = $('#search');
  $searchInput.on('keypress', _.debounce(function(event){
    results = search(tree, response, $searchInput.val().toLowerCase());
    _.each(results, function(team){
      $dropdown = $('.search-results');
      $dropdown.show()
      $dropdown.append('<li><a class="search-option">'+ team.name +'</a></li>')
    });
    $(window).on('click', function(e){
      $dropdown.empty()
      $dropdown.hide()
    })
  }, 300));
});
$.ajax('http://www.ultianalytics.com/rest/view/games?days=14').then(function(response){
  var l = response.length - 1;
  for (var i = 0; i < 10; i++){
    var game = response[l-i];
    timeSinceString = getTimeString(game.msSinceEpoch);
    $('.teams').append('<tr><td><a>' + game.teamInfo.name + ' vs. ' + game.opponentName + '</a></td><td>'+ game.ours + ' - ' + game.theirs + '</td><td>'+ timeSinceString + ' ago</td></tr>')
  }
});
function search(tree, teams, token){
  var results = prefixSearch(tree, token);
  return results.concat(simpleSearch(5 - results.length));
}
function prefixSearch(tree, token){
  if (!token) {return tree.children; }
  if (!tree[token[0]]) {return []; }
  else {return prefixSearch(tree[token[0]], token.slice(1)); }
}
function getTimeString(gameMs){
  var minutes = Math.floor((Date.now() - gameMs) / 60000);
  var hours = Math.floor(minutes / 60);
  var days = Math.floor(hours / 24);
  if (days) return days + ' days';
  if (hours) return hours + ' hours';
  if (minutes) return minutes + ' minutes';
}
function searchify(teams){
  var tree = {}
  _.each(teams, function(team){
    register(team, team.name, tree);
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
