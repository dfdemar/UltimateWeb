<%@ page 
language="java" 
contentType="text/html; charset=ISO-8859-1"
pageEncoding="ISO-8859-1"
import="com.google.appengine.api.users.*" 
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
        
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
    <link rel="shortcut icon" href="../../images/favicon.ico">
	<link rel="apple-touch-icon-precomposed" sizes="114x114" href="images/icon.png">
    <link rel="apple-touch-icon-precomposed" href="images/icon2x.png">
    <link rel="stylesheet" href="../../css/ultimate1.css" />
  	<link rel="stylesheet" href="../../css/jquery.mobile.structure-1.1.0.min.css" /> 
	<link rel="stylesheet" href="../../css/custom.css" />
	<script src="../../js/jquery-1.7.1.min.js"></script>
	<script src="../../js/jquery.mobile-1.1.0.min.js"></script>
	<script src="../../js/page-params.js"></script>
	<script src="../../js/handlebars-1.0.0.beta.6.js"></script>
	<script src="../../js/jquery.flot.patched-multi.js"></script>
	<script type="text/javascript">
		Ultimate = {};
		Ultimate.teamId = "${teamId}";
		Ultimate.teamName = "${teamName}";
	</script>
	<script src="../../js/rest.js"></script>
	<script src="../../js/stats.js"></script>
	<script src="../../js/app.js"></script>
	
	<script id="playerStatsTableTemplate" type="text/x-handlebars-template">
		<thead>
			{{#with headings}}
				<th class="tablePlayerName"><a href="#" data-stattype="playerName">{{playerName}}</a></th>
				<th><a href="#" data-stattype="plusMinusCount">{{plusMinusCount}}</a></th>
  				{{#unless ../isPerPoint}}
					<th><a href="#" data-stattype="gamesPlayed">{{gamesPlayed}}</a></th>
					<th><a href="#" data-stattype="pointsPlayed">{{pointsPlayed}}</a></th>
					<th><a href="#" data-stattype="minutesPlayed">{{minutesPlayed}}</a></th>
					<th><a href="#" data-stattype="opointsPlayed">{{opointsPlayed}}</a></th>
					<th><a href="#" data-stattype="plusMinusOLine">{{plusMinusOLine}}</a></th>
					<th><a href="#" data-stattype="dpointsPlayed">{{dpointsPlayed}}</a></th>
					<th><a href="#" data-stattype="plusMinusDLine">{{plusMinusDLine}}</a></th>
  				{{/unless}}
				<th><a href="#" data-stattype="touches">{{touches}}</a></th>
				<th><a href="#" data-stattype="goals">{{goals}}</a></th>
				<th><a href="#" data-stattype="callahans">{{callahans}}</a></th>
				<th><a href="#" data-stattype="assists">{{assists}}</a></th>
				<th><a href="#" data-stattype="passes">{{passes}}</a></th>
				<th><a href="#" data-stattype="throwaways">{{throwaways}}</a></th>
				<th><a href="#" data-stattype="stalls">{{stalls}}</a></th>
				<th><a href="#" data-stattype="miscPenalties">{{miscPenalties}}</a></th>
				<th><a href="#" data-stattype="callahaneds">{{callahaneds}}</a></th>
  				{{#unless ../isPerPoint}}
					<th><a href="#" data-stattype="passSuccess">{{passSuccess}}</a></th>
  				{{/unless}}
				<th><a href="#" data-stattype="catches">{{catches}}</a></th>
				<th><a href="#" data-stattype="drops">{{drops}}</a></th>
  				{{#unless ../isPerPoint}}
					<th><a href="#" data-stattype="catchSuccess">{{catchSuccess}}</a></th>
  				{{/unless}}
				<th><a href="#" data-stattype="ds">{{ds}}</a></th>
				<th><a href="#" data-stattype="pulls">{{pulls}}</a></th>
  				{{#unless ../isPerPoint}}
					<th><a href="#" data-stattype="pullsAvgHangtimeMillis">{{pullsAvgHangtimeMillis}}</a></th>
					<th><a href="#" data-stattype="pullsOB">{{pullsOB}}</a></th>
  				{{/unless}}
			{{/with}}
		</thead>
		<tbody>
			{{#stripeRows playerStats}}
			{{#if even}}
				<tr class="evenStatsRow">
			{{else}}
				<tr class="oddStasRow">
			{{/if}}
				<td class="tablePlayerName">{{playerName}}</td>
				<td>{{plusMinusCount}}</td>
  				{{#unless ../isPerPoint}}
					<td>{{gamesPlayed}}</td>
					<td>{{pointsPlayed}}</td>
					<td>{{minutesPlayed}}</td>
					<td>{{opointsPlayed}}</td>
					<td>{{plusMinusOLine}}</td>
					<td>{{dpointsPlayed}}</td>
					<td>{{plusMinusDLine}}</td>
  				{{/unless}}
				<td>{{touches}}</td>
				<td>{{goals}}</td>
				<td>{{callahans}}</td>
				<td>{{assists}}</td>
				<td>{{passes}}</td>
				<td>{{throwaways}}</td>
				<td>{{stalls}}</td>
				<td>{{miscPenalties}}</td>
				<td>{{callahaneds}}</td>
  				{{#unless ../isPerPoint}}
					<td>{{passSuccess}}</td>
  				{{/unless}}
				<td>{{catches}}</td>
				<td>{{drops}}</td>
  				{{#unless ../isPerPoint}}
					<td>{{catchSuccess}}</td>
  				{{/unless}}
				<td>{{ds}}</td>
				<td>{{pulls}}</td>
 				{{#unless ../isPerPoint}}
					<td>{{pullsAvgHangtimeMillis}}</td>
					<td>{{pullsOB}}</td>
				{{/unless}}
			</tr>
			{{/stripeRows}}
		</tbody>
	</script>
	
	<script id="statsDenominatorChooserTemplate" type="text/x-handlebars-template">
		<div class="ui-block-b statDenominatorRadioButtons">
			<fieldset data-role="controlgroup" data-type="horizontal" >
		  	   	<input type="radio" name="mainpage-statDenominatorType" id="mainpage-sdrb1" value="Absolute" checked="checked" />
		       	<label for="mainpage-sdrb1">Absolute</label>
		       	<input type="radio" name="mainpage-statDenominatorType" id="mainpage-sdrb2" value="PerPoint"  />
		       	<label for="mainpage-sdrb2">Per Point Played</label>
		    </fieldset>
		</div>
	</script>
	
	<script type="text/javascript">

		  var _gaq = _gaq || [];
		  _gaq.push(['_setAccount', 'UA-31918750-1']);
		  _gaq.push(['_trackPageview']);
		
		  (function() {
		    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
		  })();

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
			<li><a id="playersTab" href="#mainpage" data-prefetch class="ui-btn-active ui-state-persist">Players</a></li>
			<li><a id="gamesTab" href="#gamespage" data-prefetch >Games</a></li>
			<li><a id="teamTab" href="#teamstatspage" data-prefetch >Team</a></li>
		</ul>
	</div>
	<div class="content">
		<img class="spinner hidden" src="/images/spinner.gif" />
		<div class="hideWhenBusy">
			<div class="wideOnly"><br>Want to produce your own stats? <a class="downlaodRawStatsLink" href="javascript:void(0)">Download file of Raw Data</a></div>
		</div>		
		<div id="teamStatsNarrow" class="hideWhenBusy">
			<br>
			<div class="insetlist narrowOnly">
				<ul id="players" data-role="listview" data-theme="c" data-inset="true" ></ul>
			</div>
		</div>
		<div id="teamStatsWide" class="hideWhenBusy">
			<br>
			<fieldset class="ui-grid-a wideOnly">
				<div class="ui-block-a">
					<select name="selectGamesForPlayerTeamStats" class="gameSelect" id="selectGamesForTeamPlayerStats" data-inline="true">
						<option value="AllGames">All Games</option>
					</select>
				</div>
				<div class="teamStatsDenominatorChooser">
				</div>
			</fieldset>
			<table id="teamPlayerStats" class="playerStats"></table>
		</div>
	</div>
	<div class="footer hideWhenBusy">
		<div class="narrowOnly"><br>Want to produce your own stats? <a class="downlaodRawStatsLink" href="javascript:void(0)">Download file of Raw Data</a></div>	
		<div><br><br>Wondering how a statistic is calculated? Check out our calcs: <a href="javascript:void(0)" onclick="window.open('/calcs.html');return false;">Calculations</a></div>
		<div>&nbsp;</div>
		<div><br>Problem or suggestion?  <a href="http://www.ultianalytics.com/support.html" rel="external">Let us know</a></div>
		<div>&nbsp;</div>	
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
			<li><a id="playersTab" href="#mainpage" data-prefetch >Players</a></li>
			<li><a id="gamesTab" href="#gamespage" data-prefetch class="ui-btn-active ui-state-persist">Games</a></li>
			<li><a id="teamTab" href="#teamstatspage" data-prefetch >Team</a></li>
		</ul>
	</div>
	
		<div class="content">
		<img class="spinner hidden" src="/images/spinner.gif" />
		<div class="insetlist" class="hideWhenBusy">
			<div><h4>Games</h4></div>
			<ul id="games" data-role="listview" data-theme="a" class="game-list" data-inset="true" >
				
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
		<img class="spinner hidden" src="/images/spinner.gif" />
		<div><span class="opponentTitle"></span>&nbsp;&nbsp;&nbsp;<span class="gameScore"></span>&nbsp;&nbsp;&nbsp;<span class="gameDetails"></span></div>
		<div data-role="controlgroup" data-type="horizontal">
			<a class="gameEventsChoiceLink ui-btn-active" href="#eventspage" data-role="button">Points</a> 
			<a class="gameStatsChoiceLink" href="#gamestatspage" data-role="button">Statistics</a>
		</div>
		<div><h4>Points</h4></div>
		<div id="points" data-role="collapsible-set" class="hideWhenBusy"></div>
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
		<img class="spinner hidden" src="/images/spinner.gif" />
		<div><span class="opponentTitle"></span>&nbsp;&nbsp;&nbsp;<span class="gameScore"></span>&nbsp;&nbsp;&nbsp;<span class="gameDetails"></span></div>
		
		<fieldset class="ui-grid-a">
			<div id="gamespageDataSelection" class="ui-block-a">
				<div data-role="controlgroup" data-type="horizontal">
					<a class="gameEventsChoiceLink" href="#eventspage" data-role="button">Events</a> 
					<a class="gameStatsChoiceLink ui-btn-active" href="#gamestatspage" data-role="button">Statistics</a>
				</div>
			</div>
			<div class="gameStatsDenominatorChooser">
			</div>
		</fieldset>
		

		<div id="playerStatsNarrow" class="hideWhenBusy">
			<label for="selectPlayerRank" class="select">Statistic:</label>
			<select name="selectPlayerRank" id="selectPlayerRank">
				<option value="pointsPlayed">Points Played</option>
				<option value="minutesPlayed">Time (minutes) Played</option>
				<option value="opointsPlayed">O Points Played</option>
				<option value="dpointsPlayed">D Points Played</option>
				<option value="touches">Touches</option>
				<option value="goals">Goals</option>
				<option value="callahans">Callahans</option>
				<option value="assists">Assists</option>
				<option value="passes">Throws</option>
				<option value="catches">Catches</option>
				<option value="drops">Drops</option>
				<option value="throwaways">Throwaways</option>
				<option value="stalls">Stalled&apos;s</option>
				<option value="miscPenalties">Passer penalties (turnovers)</option>
				<option value="callahaneds">Callahaned&apos;s (other team scored)</option>
				<option value="ds">Ds</option>
				<option value="pulls">Pulls</option>
			</select>
			<table id="playerRankings">
				<tbody></tbody>
			</table>
		</div>
		<div id="playerStatsWide" class="hideWhenBusy">
			<table id="playerStatsTable" class="playerStats">
			</table>
		</div>
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
		<img class="spinner hidden" src="/images/spinner.gif" />
		<div>
			Player:&nbsp;&nbsp;<span class="playerName" id="statsPlayerNameHeading">Player</span>
		</div>
		<div>&nbsp;</div>
		<label for="selectGamesForPlayerStats" class="select">Games to include:</label>
		<select id="selectGamesForSinglePlayerStats" name="selectGamesForPlayerStats" class="gameSelect">
			<option value="AllGames">All Games</option>
		</select>
		<table class="statsTable hideWhenBusy" id="playerStats">  
			<tbody></tbody>
		</table>
	</div>
	
	<div><br><br>Wondering how a statistic is calculated? Check out our calcs: <a href="javascript:void(0)" onclick="window.open('/calcs.html');return false;">Calculations</a></div>
</div>

<div id="teamstatspage" class="pagediv" data-role="page" data-theme="b" data-title="Ultimate Team - ${teamName}">
	<div class="top-section">
		<img class="players-image" src="/images/ultimate-silhouette.png">
		<div class="pageHeading">
			<span class="teamName"></span><br> 
			<span class="pageTitle">Ultimate Team Statistics</span> 
		</div>
	</div>

	<div data-role="navbar">
		<ul>
			<li><a id="playersTab" href="#mainpage" data-prefetch>Players</a></li>
			<li><a id="gamesTab" href="#gamespage" data-prefetch >Games</a></li>
			<li><a id="teamTab" href="#teamstatspage" data-prefetch  class="ui-btn-active ui-state-persist">Team</a></li>
		</ul>
	</div>
	<div class="content">
		<img class="spinner hidden" src="/images/spinner.gif" />
		<div id="teamStats" class="hideWhenBusy">  
			<br>
			
			<fieldset class="ui-grid-a">
				<div class="ui-block-a">
					<select name="selectGamesForTeamStats" class="gameSelect" id="selectGamesForTeamStats" data-inline="true">
						<option value="AllGames">All Games</option>
					</select>
				</div>
			</fieldset>
			
			<h3 class="chartTitle">O-line vs. D-line Goals</h3>
			<table class="pieSideBySideChartTable">
				<thead>
					<tr>
						<th><h2>${teamName}</h2></th>
						<th></th>
						<th><h2>Opponents</h2></th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td class="pieSideBySideChartCell"><div id="ourGoalSummaryPie" class="pieSideBySideChart"></div></td>
						<td class="pieSideBySideChartSeparatorCell"><div>&nbsp;</div></td>
						<td class="pieSideBySideChartCell"><div id="theirGoalSummaryPie" class="pieSideBySideChart"></div></td>
					</tr>
				</tbody>
			</table>

			<h3 class="chartTitle">Breaks</h3>
			<div id="breaksGraph" class="singleTeamGraph"></div>
			
			<h3 class="chartTitle">Goals Scored per Opportunity to Score (Percent)</h3>
			<div id="goalPerOpportunityGraph" class="singleTeamGraph"></div>
			
			<h3 class="chartTitle">Seasonal Turnovers Trend (Turnovers per Touch)<br>
			(as the season progresses is the team experiencing more or less turns each game?)</h3>
			<div id="trendLineGraph" class="singleTeamGraph"></div>
			<div class="xAxisLabel">Game</div>

		</div>
	</div>
</div>

<div id="teamPasswordDialog" class="pagediv" data-role="dialog"
	data-theme="b">

	<div data-role="header">
		<h1>Enter Password</h1>
	</div>

	<div data-role="content" data-tem="c">
		<div>
			&nbsp;&nbsp;Enter <span id="teamName"></span> team password&nbsp;&nbsp;&nbsp;<span class="errorMessage" id="passwordErrorMessage"></span>
			<input id="teamPasswordInput" type="text" name="name" data-mini="true"/>
		</div> 
		<a id="passwordSubmitButton" href="#" data-role="button" data-inline="true" data-theme="a">Submit</a> 
		<a id="passwordCancelButton" href="#" data-role="button" data-inline="true" data-theme="a">Cancel</a> 
	</div>
</div>


<div id="unauthorizedpage" class="pagediv" data-role="page" data-theme="b">
	<div class="top-section">
		<img class="players-image" src="/images/ultimate-silhouette.png">
		<div class="pageHeading">
			<span class="teamName"></span><br> 
			<span class="pageTitle">Ultimate Team Statistics</span> 
		</div>
	</div>
	<div>
		<span class="unauthorizedmessage">Sorry, this team requires a password to view their stats</span>
	</div>
</div>

</body>
</html>