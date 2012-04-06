package com.summithill.ultimate.controller;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.summithill.ultimate.model.Game;
import com.summithill.ultimate.model.Player;
import com.summithill.ultimate.model.Team;

@Controller
@RequestMapping("/mobile")
public class MobileRestController extends AbstractController {
	
	@RequestMapping(value = "/test", method = RequestMethod.GET, headers="Accept=*/*")
	@ResponseBody
	public ParameterTeam getTestTeam(HttpServletRequest request) {
		getUserIdentifier(request);
		ParameterTeam testTeam = new ParameterTeam();
		testTeam.setName("Test");
		return testTeam;
	}

	@RequestMapping(value = "/team/{id}", method = RequestMethod.GET)
	@ResponseBody
	public ParameterTeam getTeam(@PathVariable String id, HttpServletRequest request) {
		getUserIdentifier(request);
		return getParameterTeam(id, request);
	}
	
	@RequestMapping(value = "/team", method = RequestMethod.POST)
	@ResponseBody
	public SaveTeamResponse saveTeam(@RequestBody ParameterTeam parameterTeam, HttpServletRequest request) {
		String userIdentifier = getUserIdentifier(request);
		try {
			Team team = service.getTeam(parameterTeam.getCloudId());
			if (team == null || (!team.getUserIdentifier().equals(userIdentifier))) {
				team = new Team(parameterTeam.getName());
			}
			parameterTeam.copyToTeam(team);
			long id = service.saveTeam(userIdentifier, team);
			savePlayers(userIdentifier, team, parameterTeam.getPlayers());
			return new SaveTeamResponse(id);
		} catch (Exception e) {
			logErrorAndThrow("error saving team", e);
			return null;
		}
	}
	
	@RequestMapping(value = "/game", method = RequestMethod.POST)
	@ResponseBody
	public void saveGame(@RequestBody ParameterGame parameterGame, HttpServletRequest request) {
		String userIdentifier = getUserIdentifier(request);
		Team team = service.getTeam(parameterGame.getTeamId());
		if (team == null) {
			logErrorAndThrow("Cannot save this game...it's parent team is no longer in the DB", null);
		}
		try {
			Game game = service.getGame(team, parameterGame.getGameId());
			if (game == null) {
				game = new Game(team);
			}
			parameterGame.copyToGame(game);
			service.saveGame(userIdentifier, game);
		} catch (Exception e) {
			logErrorAndThrow("error saving game", e);
		}
	}
	
	private void savePlayers(String userIdentifier, Team team, List<ParameterPlayer> mobilePlayers) {
		List<Player> players = new ArrayList<Player>();
		for (ParameterPlayer mobilePlayer : mobilePlayers) {
			Player player = new Player(team, mobilePlayer.getName());
			players.add(player);
		}
		service.savePlayers(userIdentifier, team, players);
	}
	

}
