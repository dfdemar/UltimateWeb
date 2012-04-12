<%@ page 
language="java" 
contentType="text/html; charset=ISO-8859-1"
pageEncoding="ISO-8859-1"
import="com.google.appengine.api.users.*,org.codehaus.jackson.map.*" 
%>
<!DOCTYPE HTML>
<!-- use the HTML tag with the manifest attribute to test offline app --> 
<!-- <html manifest="multipage-demo.manifest"> -->
<html>
<!-- saved from url=(0014)about:internet -->
<head>
	<title>Ultimate Team - ${teamName}</title> 
	
	<!--  ios offline meta stuff -->
    <meta name="apple-mobile-web-app-capable" content="yes" />  
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    <link rel="apple-touch-icon" href="images/frenchflag123-icon.png"/>
    
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
	<link rel="stylesheet" href="../../css/jquery.mobile-1.0.css" />
	<link rel="stylesheet" href="../../css/custom.css" />
	<script src="../../js/jquery-1.7.1.min.js"></script>
	<script src="../../js/jquery.mobile-1.0.min.js"></script>
	<script src="../../js/page-params.js"></script>
	<script src="../../js/handlebars-1.0.0.beta.6.js"></script>
	<script type="text/javascript">
		Ultimate = {};
		Ultimate.teamId = "${teamId}";
		Ultimate.teamName = "${teamName}";
	</script>
	<script src="../../js/rest.js"></script>
	<script src="../../js/app.js"></script>
	
	<script id="teamPlayerStatsTableTemplate" type="text/x-handlebars-template">
		<thead>
			{{#with headings}}
				<th class="tablePlayerName"><a href="#" data-stattype="playerName">{{playerName}}</a></th>
				<th><a href="#" data-stattype="pointsPlayed">{{pointsPlayed}}</a></th>
				<th><a href="#" data-stattype="secondsPlayed">{{secondsPlayed}}</a></th>
				<th><a href="#" data-stattype="opointsPlayed">{{opointsPlayed}}</a></th>
				<th><a href="#" data-stattype="dpointsPlayed">{{dpointsPlayed}}</a></th>
				<th><a href="#" data-stattype="touches">{{touches}}</a></th>
				<th><a href="#" data-stattype="goals">{{goals}}</a></th>
				<th><a href="#" data-stattype="assists">{{assists}}</a></th>
				<th><a href="#" data-stattype="passes">{{passes}}</a></th>
				<th><a href="#" data-stattype="catches">{{catches}}</a></th>
				<th><a href="#" data-stattype="drops">{{drops}}</a></th>
				<th><a href="#" data-stattype="throwaways">{{throwaways}}</a></th>
				<th><a href="#" data-stattype="ds">{{ds}}</a></th>
				<th><a href="#" data-stattype="pulls">{{pulls}}</a></th>
			{{/with}}
		</thead>
		<tbody>
			{{#each playerStats}}
			<tr>
				<td class="tablePlayerName">{{playerName}}</td>
				<td>{{pointsPlayed}}</td>
				<td>{{secondsPlayed}}</td>
				<td>{{opointsPlayed}}</td>
				<td>{{dpointsPlayed}}</td>
				<td>{{touches}}</td>
				<td>{{goals}}</td>
				<td>{{assists}}</td>
				<td>{{passes}}</td>
				<td>{{catches}}</td>
				<td>{{drops}}</td>
				<td>{{throwaways}}</td>
				<td>{{ds}}</td>
				<td>{{pulls}}</td>
			</tr>
			{{/each}}
		</tbody>
	</script>

</head>
<body>
	<div id="mainpage" class="pagediv" data-role="page" data-theme="b" data-title="Ultimate Team - ${teamName}">
	<div class="top-section">
		<img class="players-image" src="/images/ultimate-silhouette.png">
		<div class="pageHeading">
			<span class="teamName"></span><br> 
			<span class="pageTitle">Ultimate Team Statistics</span> 
		</div>
	</div>

	<div data-role="navbar">
		<ul>
			<li><a id="teamTab" href="#mainpage" data-prefetch class="ui-btn-active ui-state-persist">Team</a></li>
			<li><a id="gamesTab" href="#gamespage" data-prefetch >Games</a></li>
		</ul>
	</div>
	<div class="content">
		<div id="narrowTeamStats">
			<div class="insetlist">
				<div><h4>Players</h4></div>
				<ul id="players" data-role="listview" data-theme="d" data-inset="true" ></ul>
			</div>
		</div>
		<div id="wideTeamStats">
			<label for="selectGamesForTeamStats" class="select">Games to include:</label>
			<select name="selectGamesForTeamStats" class="gameSelect" id="selectGamesForTeamStats">
				<option value="AllGames">All Games</option>
				<option value="LastGame">Last Game</option>
				<option value="LastTournament">Last Tournament Team Played</option>
			</select>
			<table id="teamPlayerStats" class="teamPlayerStatsTable"></table>
		</div>
	</div>
	
</div>

<div id="gamespage" class="pagediv" data-role="page" data-theme="b" data-title="Ultimate Team - ${teamName}">
	<div class="top-section">
		<img class="players-image" src="/images/ultimate-silhouette.png">
		<div class="pageHeading">
			<span class="teamName"></span><br> 
			<span class="pageTitle">Ultimate Team Statistics</span> 
		</div>
	</div>

	<div data-role="navbar">
		<ul>
			<li><a id="teamTab" href="#mainpage" data-prefetch>Players</a></li>
			<li><a id="gamesTab" href="#gamespage" data-prefetch class="ui-btn-active ui-state-persist">Games</a></li>
		</ul>
	</div>
	
		<div class="content">
		<div class="insetlist">
			<div><h4>Games</h4></div>
			<ul id="games" data-role="listview" data-theme="d" class="game-list" data-inset="true" >
				
			</ul>
		</div>
	
	</div>

</div>

<div id="eventspage" class="pagediv" data-role="page" data-theme="b" data-title="Ultimate Team - ${teamName}">
	<div class="top-section">
		<img class="players-image" src="/images/ultimate-silhouette.png">
		<div class="pageHeading">
			<span class="teamName"></span><br> 
			<span class="pageTitle">Ultimate Team Statistics</span> 
		</div>
	</div>
	
	<div data-role="header" data-position="inline">
		<a href="#gamespage" data-icon="back">Back</a>
		<h1>Game</h1>
	</div>
	<div data-role="content">
		<div><span class="opponentTitle"></span>&nbsp;&nbsp;&nbsp;<span class="gameScore"></span>&nbsp;&nbsp;&nbsp;<span class="gameDetails"></span></div>
		<div data-role="controlgroup" data-type="horizontal">
			<a class="gameEventsChoiceLink ui-btn-active" href="#eventspage" data-role="button">Points</a> 
			<a class="gameStatsChoiceLink" href="#gamestatspage" data-role="button">Statistics</a>
		</div>
		<div><h4>Points</h4></div>
		<div id="points" data-role="collapsible-set"></div>
	</div>
</div>


<div id="gamestatspage" class="pagediv" data-role="page" data-theme="b" data-title="Ultimate Team - ${teamName}">
	<div class="top-section">
		<img class="players-image" src="/images/ultimate-silhouette.png">
		<div class="pageHeading">
			<span class="teamName"></span><br> 
			<span class="pageTitle">Ultimate Team Statistics</span> 
		</div>
	</div>
	
	<div data-role="header" data-position="inline">
		<a href="#gamespage" data-icon="back">Back</a>
		<h1>Game</h1>
	</div>
	<div data-role="content">
		<div><span class="opponentTitle"></span>&nbsp;&nbsp;&nbsp;<span class="gameScore"></span>&nbsp;&nbsp;&nbsp;<span class="gameDetails"></span></div>
		<div data-role="controlgroup" data-type="horizontal">
			<a class="gameEventsChoiceLink" href="#eventspage" data-role="button">Events</a> 
			<a class="gameStatsChoiceLink ui-btn-active" href="#gamestatspage" data-role="button">Statistics</a>
		</div>
		<div id="mobileTeamPlayerStats">
			<label for="selectPlayerRank" class="select">Statistic:</label>
			<select name="selectPlayerRank" id="selectPlayerRank">
				<option value="pointsPlayed">Points Played</option>
				<option value="secondsPlayed">Time (minutes) Played</option>
				<option value="opointsPlayed">O Points Played</option>
				<option value="dpointsPlayed">D Points Played</option>
				<option value="touches">Touches</option>
				<option value="goals">Goals</option>
				<option value="assists">Assists</option>
				<option value="passes">Throws</option>
				<option value="catches">Catches</option>
				<option value="drops">Drops</option>
				<option value="throwaways">Throwaways</option>
				<option value="ds">Ds</option>
				<option value="pulls">Pulls</option>
			</select>
			
			<table id="playerRankings">
				<tbody>
	
				</tbody>
			</table>
		</div>
		<table id="wideTeamPlayerStats" class="teamPlayerStatsTable">
		</table>
	</div>
</div>

<div id="playerstatspage" class="pagediv" data-role="page" data-theme="b">
	<div class="top-section">
		<img class="players-image" src="/images/ultimate-silhouette.png">
		<div class="pageHeading">
			<span class="teamName"></span><br> 
			<span class="pageTitle">Ultimate Team Statistics</span> 
		</div>
	</div>
	
	<div data-role="header" data-position="inline">
		<a href="#mainpage" data-icon="back">Back</a>
		<h1>Player Statistics</h1>
	</div>
	
	<div data-role="content">
		<div>
			Player:&nbsp;&nbsp;<span class="playerName" id="statsPlayerNameHeading">Player</span>
		</div>
		<div>&nbsp;</div>
		<label for="selectGamesForPlayerStats" class="select">Games to include:</label>
		<select name="selectGamesForPlayerStats" class="gameSelect" id="selectGamesForTeamPlayerStats">
			<option value="AllGames">All Games</option>
			<option value="LastGame">Last Game</option>
			<option value="LastTournament">Last Tournament Team Played</option>
		</select>
		<table class="statsTable" id="playerStats">
			<tbody>

			</tbody>
		</table>
	</div>
</div>

</body>
</html>