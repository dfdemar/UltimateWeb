<%@ page 
language="java" 
contentType="text/html; charset=ISO-8859-1"
pageEncoding="ISO-8859-1"
import="com.google.appengine.api.users.*"
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Ultimate Team Access Test</title>
</head>
<body>
<div>Access Test</div>
<%= (UserServiceFactory.getUserService() != null && UserServiceFactory.getUserService().isUserLoggedIn()) ? "<p>User is SIGNED IN</p>" : "User is SIGNED OUT" %>
</body>
</html>