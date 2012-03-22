package com.summithill.ultimate.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.summithill.ultimate.model.Team;
import com.summithill.ultimate.service.TeamService;

@Controller
public class WebPageController {
	@Autowired
	private  TeamService service;
	
	@RequestMapping(value = "/{id}/main", method = RequestMethod.GET)
	public String getTeamMainPage(@PathVariable String id, ModelMap model) {
		Team team = service.getTeam(id);
		model.addAttribute("teamId", id);
		model.addAttribute("teamName", team.getName());
		return "main"; // forward to jsp
	}

}
