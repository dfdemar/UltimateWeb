package com.summithill.ultimate.controller;

import static java.util.logging.Level.SEVERE;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.logging.Logger;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.summithill.ultimate.model.Game;
import com.summithill.ultimate.model.Player;
import com.summithill.ultimate.model.Team;
import com.summithill.ultimate.service.MobileService;
import com.summithill.ultimate.statistics.PlayerStatisticsCalculator;
import com.summithill.ultimate.statistics.PlayerStats;

@Controller
@RequestMapping("/view")
public class WebRestController {
    private static final Logger log = Logger.getLogger(WebRestController.class.getName());
    
	@Autowired
	private MobileService service;
	
	@RequestMapping(value = "/team/{id}", method = RequestMethod.GET)
	@ResponseBody
	public ParameterTeam getTeam(@PathVariable String id, HttpServletRequest request) {
		try {
			Team team = service.getTeam(id);
			if (team == null) {
				return null;
			} else {
				ParameterTeam pTeam = ParameterTeam.fromTeam(team);
				if ("true".equals(request.getParameter("players"))) {
					List<Player> players = service.getPlayers(team);
					List<ParameterPlayer> paramPlayers = new ArrayList<ParameterPlayer>();
					for (Player player : players) {
						paramPlayers.add(ParameterPlayer.fromPlayer(player));
					}
					pTeam.setPlayers(paramPlayers);
				}
				return pTeam;
			}
		} catch (Exception e) {
			logErrorAndThrow("Error on getTeam", e);
			return null;
		}
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
		try {
			Team team = service.getTeam(teamId);
			if (team == null) {
				return null;
			} else {
				// note: assuming that Text objects are not pulled from the DB until referenced.  Therefore we aren't creating a memory burden by reading in a 100 games
				List<Game> games = service.getGames(team);
				List<ParameterGame> pGames = new ArrayList<ParameterGame>();
				for (Game game : games) {
					game.setPointsJson(null);  // dump the points JSON so we don't include it in the response
					pGames.add(ParameterGame.fromGame(game));
				}
				return pGames;
			}
		} catch (Exception e) {
			logErrorAndThrow("Error on getGames", e);
			return null;
		}
	}
	
	@RequestMapping(value = "/team/{teamId}/game/{gameId}", method = RequestMethod.GET)
	@ResponseBody
	public ParameterGame getGame(@PathVariable String teamId, @PathVariable String gameId, HttpServletRequest request) {
		try {
			Team team = service.getTeam(teamId);
			if (team == null) {
				return null;
			} else {
				Game game = service.getGame(team, gameId);
				return ParameterGame.fromGame(game);
			}
		} catch (Exception e) {
			logErrorAndThrow("Error on getGame", e);
			return null;
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
			logErrorAndThrow("Error on getGame", e);
			return null;
		}
	}
	
	private void logErrorAndThrow(String message, Throwable t) {
		log.log(SEVERE, message, t);
		throw new RuntimeException(message, t);
	}
}
