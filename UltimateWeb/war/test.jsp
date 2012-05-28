<%@ page 
language="java" 
contentType="text/html; charset=ISO-8859-1"
pageEncoding="ISO-8859-1"
import="com.google.appengine.api.users.*,org.codehaus.jackson.map.*" 
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Ultimate Team</title>
</head>
<body>
<div>Welcome to Ultimate Team</div>

<%  
		UserService userService = UserServiceFactory.getUserService();

        String thisURL = request.getRequestURI();
        response.setContentType("text/html");
        if (request.getUserPrincipal() != null) {
            response.getWriter().println("<p>Hello, " + request.getUserPrincipal().getName() + 
            		"!  You can <a href=\"" + userService.createLogoutURL(thisURL) + "\">sign out</a>.</p>");
        } else {
        	response.getWriter().println("<p>Please <a href=\"" + userService.createLoginURL(thisURL) +
                                     "\">sign in</a>.</p>");
        }
%>
</body>
</html>