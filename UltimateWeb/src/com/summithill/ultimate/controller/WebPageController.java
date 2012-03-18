package com.summithill.ultimate.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
//@RequestMapping("/team")
public class WebPageController {
	
	@RequestMapping(value = "/{id}/main", method = RequestMethod.GET)
	public String getTeamMainPage(@PathVariable String id, ModelMap model) {
		addTeamId(model, id);
		return "main"; // forward to jsp
	}

	private void addTeamId(ModelMap model, String id) {
		model.addAttribute("teamId", id);
	}
}
