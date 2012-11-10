package com.summithill.ultimate.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.summithill.ultimate.model.Team;

@Controller
public class WebPageController extends AbstractController {
	
	@RequestMapping(value = "/{id}/main", method = RequestMethod.GET)
	public String getTeamMainPage(@PathVariable String id, ModelMap model) {
		Team team = service.getTeam(id);
		if (team == null) {
			model.addAttribute("teamName", "TEAM NOT FOUND");
		} else {
			model.addAttribute("teamId", id);
			model.addAttribute("teamName", team.getName());
		}
		return "main"; // forward to jsp
	}
	
	@RequestMapping(value = "/admin", method = RequestMethod.GET)
	public String getAdminPage(ModelMap model, HttpServletRequest request) {

		UserService userService = UserServiceFactory.getUserService();
		String thisURL = request.getRequestURI();
		String logonUrl = userService.createLoginURL(thisURL);
		String logoutUrl = userService.createLogoutURL(thisURL);

        if (request.getUserPrincipal() != null) {
    		model.addAttribute("loginUrl", logonUrl);
    		model.addAttribute("logoutUrl", logoutUrl);
    		model.addAttribute("userName", request.getUserPrincipal().getName());
    		return "admin"; // forward to jsp
        } else {
        	return "redirect:" + logonUrl;
        }
	}

	@RequestMapping(value = "/master", method = RequestMethod.GET)
	public String getMasterAdminPage(ModelMap model, HttpServletRequest request) {

		UserService userService = UserServiceFactory.getUserService();
		String thisURL = request.getRequestURI();
		String logonUrl = userService.createLoginURL(thisURL);
		String logoutUrl = userService.createLogoutURL(thisURL);

        if (request.getUserPrincipal() != null) {
    		model.addAttribute("loginUrl", logonUrl);
    		model.addAttribute("logoutUrl", logoutUrl);
    		model.addAttribute("userName", request.getUserPrincipal().getName());
    		return "master"; // forward to jsp
        } else {
        	return "redirect:" + logonUrl;
        }
	}
}
