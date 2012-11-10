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
	<title>Ultimate Team Master Admin</title> 
	
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
	<script type="text/javascript">
	Ultimate = {};
	Ultimate.userName = "${userName}";
	Ultimate.logonUrl = "${logonUrl}";
	Ultimate.logoutUrl =" ${logoutUrl}";
	</script>
	<script src="../../js/rest.js"></script>
	<script src="../../js/master.js"></script>

</head>
<body>

	<div id="mainpage" class="pagediv" data-role="page" data-theme="b" data-cache="never">
		<div class="top-section">
			<img class="players-image" src="/images/ultimate-silhouette.png">
			<div class="pageHeading">
				<span class="teamName">Master Admin Tool</span><br>
				<span class="adminUser"></span><a href="#" class="logout" rel=external>logout</a><br><br>
			</div>
			
		</div>

		<div class="content">
			<h2>Copy a team to master user</h2>
			<div data-role="fieldcontain">
				<label for="copyteamid">ID of team to copy:</label>
				<input type="text" name="copyteamid" id="copyteamid" value=""/>
				<a id="copyButton" href="javascript:void(0);" data-role="button" data-inline="false">Copy</a>
			</div>
	
		</div>

	</div>


	
</body>
</html>