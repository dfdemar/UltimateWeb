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
	<title>Ultimate Team</title> 
	
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
	<script src="../../js/rest.js"></script>
	<script src="../../js/app.js"></script>
	<script type="text/javascript">
	Ultimate = {};
	Ultimate.teamId = ${teamId};
	</script>

</head>
<body>
<div id="mainpage" class="pagediv" data-role="page" data-theme="b">
	<div class="top-section">
			<img class="players-image" src="/images/ultimate-silhouette.png">
		<div class="pageHeading">
			<span class="teamName"></span><br> 
			<span class="pageTitle">Ultimate Team Statistics</span> 
		</div>
	</div>

	<div data-role="navbar">
		<ul>
			<li><a id="teamTab" href="#mainpage" data-prefetch class="ui-btn-active ui-state-persist">Players</a></li>
			<li><a id="gamesTab" href="#gamespage" data-prefetch >Games</a></li>
		</ul>
	</div>
	<div class="content">
		<div class="insetlist">
			<div><h4>Players</h4></div>
			<ul id="players" data-role="listview" data-theme="d" data-inset="true" >
				
			</ul>
		</div>
	</div>
</div>

<div id="gamespage" class="pagediv" data-role="page" data-theme="b">
	<div class="top-section">
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

<div id="eventspage" class="pagediv" data-role="page" data-theme="b">
	<div class="top-section">
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
			<a class="gameEventsChoiceLink ui-btn-active" href="#eventspage" data-role="button">Events</a> 
			<a class="gameStatsChoiceLink" href="#gamestatspage" data-role="button">Statistics</a>
		</div>
		<div><h4>Points</h4></div>
		<div id="points" data-role="collapsible-set"></div>
	</div>
</div>


<div id="gamestatspage" class="pagediv" data-role="page" data-theme="b">
	<div class="top-section">
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
		<label for="selectPlayerRank" class="select">Statistic:</label>
		<select name="selectPlayerRank" id="selectPlayerRank">
			<option value="pointsPlayed">Points Played</option>
			<option value="opointsPlayed">O Points Played</option>
			<option value="dpointsPlayed">D Points Played</option>
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
</div>

<div id="playerstatspage" class="pagediv" data-role="page" data-theme="b">
	<div class="top-section">
		<div class="pageHeading">
			<span class="teamName"></span><br> 
			<span class="pageTitle">Ultimate Team Statistics</span> 
		</div>
	</div>
	<div data-role="header" data-position="inline">
		<a href="#mainpage" data-icon="back">Back</a>
		<h1>Player</h1>
	</div>
	
	<div data-role="content">
		<h2 id="statsPlayerNameHeading">Player</h2>
		<label for="selectGamesForPlayerStats" class="select">Games to include:</label>
		<select name="selectGamesForPlayerStats" id="selectGamesForPlayerStats">
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