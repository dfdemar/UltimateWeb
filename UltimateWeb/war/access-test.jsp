<%@ page 
language="java" 
contentType="text/html; charset=ISO-8859-1"
pageEncoding="ISO-8859-1"
import="com.google.appengine.api.users.*"
%>
<%
    response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1
    response.setHeader("Pragma", "no-cache"); // HTTP 1.0
    response.setDateHeader("Expires", 0); // Proxies.
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Ultimate Team Access Test</title>
</head>
<body>
<div>Access Test</div>
<%  
		String responseMessage = "";
		String email = "";
		String redirectParam = request.getParameter("redirect");
		boolean shouldRedirect = redirectParam != null && redirectParam.equals("true");
		
		if (shouldRedirect && request.getUserPrincipal() == null) {
			UserService userService = UserServiceFactory.getUserService();
	        String thisURL = request.getRequestURI();
	        String loginUrl = userService.createLoginURL(thisURL);
	        response.sendRedirect(loginUrl);
		} else {
			boolean isSignedIn = UserServiceFactory.getUserService() != null && UserServiceFactory.getUserService().isUserLoggedIn();
			responseMessage = isSignedIn ? "User is SIGNED IN" : "User is SIGNED OUT";
			if (isSignedIn) {
				email = UserServiceFactory.getUserService().getCurrentUser().getEmail();
			}
		}
%>

<%=responseMessage%>
<form>
<input id="email" type="hidden" value="<%=email%>">
</form>

</body>
</html>