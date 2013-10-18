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
	<title>Ultimate Team Admin</title> 
	
	<!--  ios offline meta stuff -->
    <meta name="apple-mobile-web-app-capable" content="yes" />  
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
	<link rel="shortcut icon" href="../../images/favicon.ico">
	<link rel="stylesheet" href="../../css/jquery.mobile-1.2.0.min.css" />
    <link rel="stylesheet" href="../../css/ultimate1.css" />
  	<link rel="stylesheet" href="../../css/jquery.mobile.structure-1.1.0.min.css" /> 
	<link rel="stylesheet" href="../../css/custom.css" />
	<script src="../../js/jquery-1.7.1.min.js"></script>
	<script src="../../js/jquery.mobile-1.1.0.min.js"></script>
	<script src="../../js/page-params.js"></script>
	<script src="../../js/handlebars-1.0.0.beta.6.js"></script>	
	<script type="text/javascript">
	Ultimate = {};
	Ultimate.userName = "${userName}";
	Ultimate.logonUrl = "${logonUrl}";
	Ultimate.logoutUrl =" ${logoutUrl}";
	Ultimate.isAdminSite = true;
	</script>
	<script src="../../js/rest.js"></script>
	<script src="../../js/admin.js"></script>
	
	<script id="playersListTemplate" type="text/x-handlebars-template">
		{{#each players}}
			<li>
				<div data-role="controlgroup" data-type="horizontal">
					<span class="playerListName">{{name}}</span>
					<a href="#playerChangeDialog?change=merge&team={{teamId}}&player={{name}}" data-role="button">Merge</a>
					&nbsp;&nbsp;&nbsp;&nbsp;
					<a href="#playerChangeDialog?change=delete&team={{teamId}}&player={{name}}" data-role="button">Delete</a>
					&nbsp;&nbsp;&nbsp;&nbsp;
					<a href="#playerChangeDialog?change=rename&team={{teamId}}&player={{name}}" data-role="button">Rename</a>
				</div>
			</li>
		{{/each}}
	</script>
	
	<script id="moveToPlayerListTemplate" type="text/x-handlebars-template">
		<option value="Anonymous">Anonymous</option>
		{{#each players}}
		<option value="{{name}}">{{name}}</option>
		{{/each}}
	</script>

</head>
<body>

	<div id="mainpage" class="pagediv" data-role="page" data-theme="b" data-cache="never">
		<div class="top-section">
			<img class="players-image" src="/images/ultimate-silhouette.png">
			<div class="pageHeading">
				<span class="teamName">Admin Tool</span><br>
				<span class="adminUser"></span><a href="#" class="logout" rel=external>logout</a><br><br>
				<span	class="pageTitle">Ultimate Team Statistics</span>
			</div>
			
		</div>

		<div data-role="header" data-position="inline">
			<h1>Teams</h1>
		</div>

		<div class="content">
			<div id="admin-teams" class="insetlist">
				<div>
					<h4>Teams</h4>
				</div>
				<ul id="teams" data-role="listview" data-theme="d" class="game-list" data-inset="true">

				</ul>
			</div>
		</div>
		<div><br>&nbsp;<a href="#" class="appLink" rel=external>Stats Collecter App</a><br>&nbsp;</div>
		
		<div class="footer">
		<a href="http://www.ultimate-numbers.com/">About</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
		<a href="http://www.ultimate-numbers.com/privacy.html">Privacy</a>
		</div>
		<br><br>
	</div>
	

	<div id="teamsettingspage" class="pagediv" data-role="page" data-theme="b">
		<div class="top-section">
			<img class="players-image" src="/images/ultimate-silhouette.png">
			<div class="pageHeading">
				<span class="teamName">Admin Tool</span><br>
				<span class="adminUser"></span><br><br>
				<span class="pageTitle">Ultimate Team Statistics</span>
			</div>
			<a href="#" class="logout" rel=external>logout</a>
		</div>

		<div data-role="header" data-position="inline">
			<a href="#mainpage" data-icon="back" data-theme="d">Teams</a>
			<h1>Team</h1>
		</div>

		<div class="content">
			<div id="admin-games" class="insetlist">
				<div id="adminTeamHeading">
					<span class="teamTitle"></span>&nbsp;&nbsp;&nbsp;&nbsp;
					<a rel="external" class="teamWebsite" href="/team/{TEAMID}/main">Team Website</a>
				</div>
				
				<div>
				
					<fieldset class="team-view-choice-selector-teamsettingspage" data-role="controlgroup" data-type="horizontal">
			         	<input type="radio" name="team-view-choice1" id="team-view-choice-teamsettingspage-teamsettingspage" value="teamsettingspage"/>
			         	<label for="team-view-choice-teamsettingspage-teamsettingspage">Settings</label>
			
			         	<input type="radio" name="team-view-choice1" id="team-view-choice-teamsettingspage-teamgamespage" value="teamgamespage"  />
			         	<label for="team-view-choice-teamsettingspage-teamgamespage">Games</label>
			
			         	<input type="radio" name="team-view-choice1" id="team-view-choice-teamsettingspage-teamplayerspage" value="teamplayerspage" />
			         	<label for="team-view-choice-teamsettingspage-teamplayerspage">Players</label>
				    </fieldset>
					
				</div>
				
			<br><br>
				<div class="teamPasswordLabel">
					Team Website Password:&nbsp;&nbsp;&nbsp;&nbsp;
					<a class="teamPassword" href="#" data-inline="true"></a>   
				</div>				
				<div>
					(visitors to your website will be asked to enter this password to see this team's statistics)
				</div>
				<br/>	
			</div>
		</div>
		<div><br><a href="#" class="appLink" rel=external>Stats Collecter App</a><br>&nbsp;</div>
	</div>

	<div id="teamgamespage" class="pagediv" data-role="page" data-theme="b">
		<div class="top-section">
			<img class="players-image" src="/images/ultimate-silhouette.png">
			<div class="pageHeading">
				<span class="teamName">Admin Tool</span><br>
				<span class="adminUser"></span><br><br>
				<span class="pageTitle">Ultimate Team Statistics</span>
			</div>
			<a href="#" class="logout" rel=external>logout</a>
		</div>

		<div data-role="header" data-position="inline">
			<a href="#mainpage" data-icon="back" data-theme="d">Teams</a>
			<h1>Team</h1>
		</div>

		<div class="content">
			<div id="admin-games" class="insetlist">
				<div id="adminTeamHeading">
					<span class="teamTitle"></span>&nbsp;&nbsp;&nbsp;&nbsp;
					<a rel="external" class="teamWebsite" href="/team/{TEAMID}/main">Team Website</a>
				</div>
				
					<fieldset class="team-view-choice-selector-teamgamespage" data-role="controlgroup" data-type="horizontal">
			         	<input type="radio" name="team-view-choice2" id="team-view-choice-teamgamespage-teamsettingspage" value="teamsettingspage"/>
			         	<label for="team-view-choice-teamgamespage-teamsettingspage">Settings</label>
			
			         	<input type="radio" name="team-view-choice2" id="team-view-choice-teamgamespage-teamgamespage" value="teamgamespage" />
			         	<label for="team-view-choice-teamgamespage-teamgamespage">Games</label>
			
			         	<input type="radio" name="team-view-choice2" id="team-view-choice-teamgamespage-teamplayerspage" value="teamplayerspage" />
			         	<label for="team-view-choice-teamgamespage-teamplayerspage">Players</label>
				    </fieldset>
				
 				<div class="gamesTitle">
				</div>					
				
				<ul id="games" data-role="listview" data-theme="c" data-inset="true">
				</ul>
			
				<div>
					<br>
					<a class="importGameLink" href="#" data-inline="true" data-role="button">Import Game</a>   
				</div>	
				
			</div>
		</div>
		<div><br><a href="#" class="appLink" rel=external>Stats Collecter App</a><br>&nbsp;</div>
	</div>


	<div id="teamplayerspage" class="pagediv" data-role="page" data-theme="b">
		<div class="top-section">
			<img class="players-image" src="/images/ultimate-silhouette.png">
			<div class="pageHeading">
				<span class="teamName">Admin Tool</span><br>
				<span class="adminUser"></span><br><br>
				<span class="pageTitle">Ultimate Team Statistics</span>
			</div>
			<a href="#" class="logout" rel=external>logout</a>
		</div>

		<div data-role="header" data-position="inline">
			<a href="#mainpage" data-icon="back" data-theme="d">Teams</a>
			<h1>Team</h1>
		</div>

		<div class="content">
			<div id="admin-games" class="insetlist">
				<div id="adminTeamHeading">
					<span class="teamTitle"></span>&nbsp;&nbsp;&nbsp;&nbsp;
					<a rel="external" class="teamWebsite" href="/team/{TEAMID}/main">Team Website</a>
				</div>

				<div>
					<fieldset class="team-view-choice-selector-teamplayerspage" data-role="controlgroup" data-type="horizontal">
			         	<input type="radio" name="team-view-choice3" id="team-view-choice-teamplayerspage-teamsettingspage" value="teamsettingspage"/>
			         	<label for="team-view-choice-teamplayerspage-teamsettingspage">Settings</label>
			
			         	<input type="radio" name="team-view-choice3" id="team-view-choice-teamplayerspage-teamgamespage" value="teamgamespage" />
			         	<label for="team-view-choice-teamplayerspage-teamgamespage">Games</label>
			
			         	<input type="radio" name="team-view-choice3" id="team-view-choice-teamplayerspage-teamplayerspage" value="teamplayerspage" />
			         	<label for="team-view-choice-teamplayerspage-teamplayerspage">Players</label>
				    </fieldset>
				</div>
				
				<div>
					<ul id="playersList" data-role="listview" data-inset="true">
					</ul>
				</div>
					
			</div>
		</div>
		<div><br><a href="#" class="appLink" rel=external>Stats Collecter App</a><br>&nbsp;</div>
	</div>

	<div id="confirmDeleteDialog" class="pagediv" data-role="dialog"
		data-theme="b">

		<div data-role="header">
			<h1>Confirm Delete</h1>
		</div>

		<div data-role="content" data-tem="c">
			<div>Do you really want to delete <strong><span id="deleteDescription"></span></strong>?</div> 
			<a id="deleteConfirmedButton" href="#" data-role="button" data-inline="true" data-theme="a">Yes</a> 
			<a href="#" data-role="button" data-inline="true" data-rel="back">No</a>
		</div>
	</div>
	
	<div id="teamPasswordDialog" class="pagediv" data-role="dialog"
		data-theme="b">
 
		<div data-role="header">
			<h1>New Password</h1>
		</div>
 
		<div data-role="content" data-tem="c">
			<div>
				&nbsp;&nbsp;Enter New Password&nbsp;&nbsp;&nbsp;<span class="errorMessage" id="passwordSaveErrorMessage"></span>
				<input id="teamPasswordInput" type="text" name="name" data-mini="true"/>
			</div> 
			<a id="savePasswordButton" href="#" data-role="button" data-inline="true" data-theme="a">Save</a> 
			<a id="removePasswordButton" href="#" data-role="button" data-inline="true" data-theme="a">Remove Password</a> 
			<a href="#" data-role="button" data-inline="true" data-rel="back">Cancel</a>
		</div>
	</div>
	
	<div id="playerChangeDialog" class="pagediv" data-role="dialog"
		data-theme="b">
 
		<div data-role="header">
			<h1 id="player-change-dialog-title"></h1>
		</div>
 
		<div data-role="content" data-tem="c">
			<div class="dialogInstructions">
				<div><span id="player-change-dialog-action-description"></span> player: <strong><span class="player-change-dialog-player"></span></strong></div><br>
				<div id="player-change-dialog-instructions"></div><br>
				<div id="player-change-dialog-target-select">		
					<label for="moveToPlayerList" class="select" id="player-change-dialog-target-select-label"></label>
					<select name="moveToPlayerList" id="moveToPlayerList">
					</select>
				</div><br>
				<div id="player-change-dialog-player-new-name">
					<label for="basic">New Name:</label>
    				<input type="text" name="name" id="player-change-dialog-player-new-name-field" value=""/>
				</div>
			</div> 
			<a id="player-change-dialog-doit-button" href="#" data-role="button" data-inline="true" data-theme="a"></a> 
			<a href="#" data-role="button" data-inline="true" data-rel="back">Cancel</a>
		</div>
		<img class="spinner hidden" src="/images/spinner.gif" />
	</div>
	
	<div id="importGameDialog" class="pagediv" data-role="dialog"
		data-theme="b">

		<div data-role="header">
			<h1>Import Game</h1>
		</div>

		<div data-role="content" data-tem="c">
			<form action="/team/{teamId}/import/game" method="post" enctype="multipart/form-data" class="importGameForm" data-ajax="false">
				<div>Browse to the game export file (<i>.iexport</i> file extension) on your computer and then press <strong>Import</strong>.</div><br>
				<div><span>File to import: </span><input class="gameFileUploadInput" type="file" name="file" /></div><br>
				<input type="submit" value="Import" data-inline="true"/>
				<a href="#" data-role="button" data-inline="true" data-rel="back">Cancel</a>
			</form>
		</div>
	</div>
	
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

	
	


</body>
</html>