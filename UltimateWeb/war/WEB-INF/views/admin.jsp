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
	<title>Ultimate Team Admin</title> 
	
	<!--  ios offline meta stuff -->
    <meta name="apple-mobile-web-app-capable" content="yes" />  
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
<link rel="shortcut icon" href="../../images/favicon.ico">
	<link rel="stylesheet" href="../../css/jquery.mobile-1.1.0.min.css" />
	<link rel="stylesheet" href="../../css/custom.css" />
	<script src="../../js/jquery-1.7.1.min.js"></script>
	<script src="../../js/jquery.mobile-1.1.0.min.js"></script>
	<script src="../../js/page-params.js"></script>
	<script src="../../js/rest.js"></script>
	<script src="../../js/admin.js"></script>
	<script type="text/javascript">
	Ultimate = {};
	Ultimate.userName = "${userName}";
	Ultimate.logonUrl = "${logonUrl}";
	Ultimate.logoutUrl =" ${logoutUrl}";
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
	</div>

	<div id="gamespage" class="pagediv" data-role="page" data-theme="b">
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
			<a href="#mainpage" data-icon="back">Teams</a>
			<h1>Games</h1>
		</div>

		<div class="content">
			<div id="admin-games" class="insetlist">
				<div id="adminTeamHeading">
					<span class="teamTitle"></span>&nbsp;&nbsp;&nbsp;&nbsp;
					<a rel="external" id="teamWebsite" href="/team/{TEAMID}/main">Team Website</a>
				</div>
				<ul id="games" data-role="listview" data-theme="c" data-inset="true">

				</ul>
			</div>
		</div>
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




</body>
</html>