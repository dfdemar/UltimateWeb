package com.summithill.ultimate.controller;

import java.util.ArrayList;
import java.util.Collection;
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
import com.summithill.ultimate.statistics.PlayerStatisticsCalculator;
import com.summithill.ultimate.statistics.PlayerStats;

@Controller
@RequestMapping("/view")
public class WebRestController extends AbstractController {
    
	@RequestMapping(value = "/team/{id}", method = RequestMethod.GET)
	@ResponseBody
	public ParameterTeam getTeam(@PathVariable String id, HttpServletRequest request) {
		return getParameterTeam(id, request);
	}
	
	@RequestMapping(value = "/teams", method = RequestMethod.GET)
	@ResponseBody
	public List<ParameterTeam> getTeams(HttpServletRequest request) {
		return getParameterTeams(request);
	}
	
	@RequestMapping(value = "/team/{id}/players", method = RequestMethod.GET)
	@ResponseBody
	public List<ParameterPlayer> getPlayers(@PathVariable String id, HttpServletRequest request) {
		try {
			Team team = service.getTeam(id);
			if (team == null) {
				return null;
			} else {
				List<Player> players = service.getPlayers(team);
				List<ParameterPlayer> paramPlayers = new ArrayList<ParameterPlayer>();
				for (Player player : players) {
					paramPlayers.add(ParameterPlayer.fromPlayer(player));
				}
				return paramPlayers;
			}
		} catch (Exception e) {
			logErrorAndThrow("Error on getPlayers", e);
			return null;
		}
	}
	
	@RequestMapping(value = "/team/{teamId}/games", method = RequestMethod.GET)
	@ResponseBody
	public List<ParameterGame> getGames(@PathVariable String teamId, HttpServletRequest request) {
		return getParameterGames(teamId);
	}
	
	@RequestMapping(value = "/team/{teamId}/game/{gameId}", method = RequestMethod.GET)
	@ResponseBody
	public ParameterGame getGame(@PathVariable String teamId, @PathVariable String gameId, HttpServletRequest request) {
		return getParameterGame(teamId, gameId);
	}
	
	@RequestMapping(value = "/team/{teamId}/delete", method = RequestMethod.POST)
	@ResponseBody
	public void deleteTeam(@PathVariable String teamId, HttpServletRequest request) {
		//if (true) {throw new UnauthorizedException();} 
		String userIdentifier = getUserIdentifier(request);
		try {
			Team team = service.getTeam(teamId);
			if (team == null) {
				throw new RuntimeException("Team " + teamId + " not found");
			} else {
				service.deleteTeam(team);
			}
		} catch (Exception e) {
			logErrorAndThrow(userIdentifier, "Error on deleteTeam", e);
		}
	}
	
	@RequestMapping(value = "/team/{teamId}/game/{gameId}/delete", method = RequestMethod.POST)
	@ResponseBody
	public void deleteGame(@PathVariable String teamId, @PathVariable String gameId, HttpServletRequest request) {
		String userIdentifier = getUserIdentifier(request);
		try {
			Team team = service.getTeam(teamId);
			if (team == null) {
				throw new RuntimeException("Team " + teamId + " not found");
			} else {
				Game game = service.getGame(team, gameId);
				service.deleteGame(game);
			}
		} catch (Exception e) {
			logErrorAndThrow(userIdentifier, "Error on deleteGame", e);
		}
	}
	
	@RequestMapping(value = "/team/{teamId}/stats/player", method = RequestMethod.POST)
	@ResponseBody
	public Collection<PlayerStats> getTeamPlayerStats(@PathVariable String teamId, @RequestBody List<String> gameIds, HttpServletRequest request) {
		try {
			Team team = service.getTeam(teamId);
			if (team == null) {
				return null;
			} else {
				return new PlayerStatisticsCalculator(service).calculateStats(team, gameIds);
			}
		} catch (Exception e) {
			logErrorAndThrow("Error on getTeamPlayerStats", e);
			return null;
		}
	}
	

}
