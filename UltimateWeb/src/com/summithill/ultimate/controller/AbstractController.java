package com.summithill.ultimate.controller;

import static java.util.logging.Level.SEVERE;

import java.util.logging.Logger;

import javax.servlet.http.HttpServletRequest;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;

public class AbstractController {
	protected Logger log = Logger.getLogger(MobileRestController.class.getName());
    
	protected String getUserIdentifier(HttpServletRequest request) {
		//if (true) {throw new UnauthorizedException();} // force authorization error
		if (request.getRequestURL().toString().contains("//local")) {
			return "localtestuser";
		}
		UserService userService = UserServiceFactory.getUserService();
		if (userService != null && userService.isUserLoggedIn()) {
			return userService.getCurrentUser().getUserId();
		} else {
			throw new UnauthorizedException();
		}
	}

	protected void logErrorAndThrow(String message, Throwable t) {
		if (t == null) {
			log.log(SEVERE, message);
		} else {
			log.log(SEVERE, message, t);
		}
		throw new RuntimeException(message, t);
	}
	
	protected void logErrorAndThrow(String userIdentifier, String message, Throwable t) {
		String userQualifiedMessage = "User " + userIdentifier + " experienced error: " + message;
		logErrorAndThrow(userQualifiedMessage, t);
	}
}
