package com.summithill.ultimate.controller;

import static java.util.logging.Level.SEVERE;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.summithill.ultimate.model.Game;
import com.summithill.ultimate.model.Player;
import com.summithill.ultimate.model.Team;
import com.summithill.ultimate.service.TeamService;

public class AbstractController {
	protected Logger log = Logger.getLogger(MobileRestController.class.getName());
	
	@Autowired
	protected TeamService service;
    
	protected ParameterTeam getParameterTeam(@PathVariable String id, HttpServletRequest request) {
		return this.getParameterTeam(id, request, false);
	}
	
	protected ParameterTeam getParameterTeam(@PathVariable String id, HttpServletRequest request, boolean includePassword) {
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
				if (includePassword) {
					pTeam.setPassword(team.getPassword());
				}
				return pTeam;
			}
		} catch (Exception e) {
			logErrorAndThrow("Error on getTeam", e);
			return null;
		}
	}
	
	protected List<ParameterTeam> getParameterTeams(HttpServletRequest request) {
		String userIdentifier = getUserIdentifier(request);
		try {
			List<ParameterTeam> teamsResponseList = new ArrayList<ParameterTeam>();
			List<Team> teams = service.getTeams(userIdentifier);
			for (Team team : teams) {
				ParameterTeam pTeam = ParameterTeam.fromTeam(team);
				teamsResponseList.add(pTeam);
			}
			return teamsResponseList;
		} catch (Exception e) {
			logErrorAndThrow("Error on getTeams", e);
			return null;
		}
	}
	
	protected List<ParameterGame> getParameterGames(String teamId) {
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
	
	
	protected ParameterGame getParameterGame(String teamId, String gameId) {
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
	
	protected void verifyAdminUser(HttpServletRequest request) {
		this.getUserIdentifier(request);
	}
	
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
	
	protected void addExpireHeader(HttpServletResponse response, long minutesBeforeExpire) {
		response.setDateHeader("Expires", System.currentTimeMillis() + minutesBeforeExpire * 60 * 1000);
	}
	
	protected void addStandardExpireHeader(HttpServletResponse response) {
		this.addExpireHeader(response, 60);
	}

}
