package com.summithill.ultimate.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.summithill.ultimate.model.Game;
import com.summithill.ultimate.model.Player;
import com.summithill.ultimate.model.Team;
import com.summithill.ultimate.statistics.AllStatisticsCalculator;
import com.summithill.ultimate.statistics.AllStats;
import com.summithill.ultimate.statistics.PlayerStatisticsCalculator;
import com.summithill.ultimate.statistics.PlayerStats;
import com.summithill.ultimate.statistics.RawStatisticsExporter;
import com.summithill.ultimate.statistics.TeamStatisticsCalculator;
import com.summithill.ultimate.statistics.TeamStats;

@Controller
@RequestMapping("/view")
public class WebRestController extends AbstractController {

	@RequestMapping(value = "/team/{id}", method = RequestMethod.GET)
	@ResponseBody
	public ParameterTeam getTeam(@PathVariable String id, HttpServletRequest request, HttpServletResponse response) {
		this.addStandardExpireHeader(response);
		return getParameterTeamAfterVerifyingWebsiteAccess(id, request);
	}
	
	@RequestMapping(value = "/admin/team/{id}", method = RequestMethod.GET)
	@ResponseBody
	public ParameterTeam getTeamForAdmin(@PathVariable String id, @RequestParam(value = "includePassword", required = false) boolean includePassword, HttpServletRequest request, HttpServletResponse response) {
		this.addStandardExpireHeader(response);
		if (includePassword) {
			this.verifyAdminUser(request);
		}
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
				verifyAccess(team, request);
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
	public List<ParameterGame> getGames(@PathVariable String teamId, HttpServletRequest request, HttpServletResponse response) {
		this.addStandardExpireHeader(response);
		return getParameterGames(teamId, request, true);
	}
	
	@RequestMapping(value = "/admin/team/{teamId}/games", method = RequestMethod.GET)
	@ResponseBody
	public List<ParameterGame> getGamesForAdmin(@PathVariable String teamId, HttpServletRequest request, HttpServletResponse response) {
		this.addStandardExpireHeader(response);
		return getParameterGames(teamId, request);
	}
	
	@RequestMapping(value = "/team/{teamId}/game/{gameId}", method = RequestMethod.GET)
	@ResponseBody
	public ParameterGame getGame(@PathVariable String teamId, @PathVariable String gameId, HttpServletRequest request) {
		return getParameterGame(teamId, gameId, request, true);
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
	
	@RequestMapping(value = "/team/{teamId}/password/{password}", method = RequestMethod.POST)
	@ResponseBody
	public void setTeamPassword(@PathVariable String teamId, @PathVariable String password, HttpServletRequest request) {
		String userIdentifier = getUserIdentifier(request);
		try {
			Team team = service.getTeam(teamId);
			if (team == null) {
				throw new RuntimeException("Team " + teamId + " not found");
			} else {
				team.setPassword(password);
				service.saveTeam(userIdentifier, team);
			}
		} catch (Exception e) {
			logErrorAndThrow(userIdentifier, "Error on setTeamPassword", e);
		}
	}
	
	@RequestMapping(value = "/team/{teamId}/authenticate/{password}", method = RequestMethod.POST)
	@ResponseBody
	public void signon(@PathVariable String teamId, @PathVariable String password, HttpServletRequest request, HttpServletResponse response) {
		try {
			Team team = service.getTeam(teamId);
			if (team == null) {
				throw new RuntimeException("Team " + teamId + " not found");
			} else {
				if (isPasswordCorrect(team, password)) {
					addPasswordHashCookie(response, team);
				} else {
					throw new UnauthorizedException();
				}
			}
		} catch (Exception e) {
			logErrorAndThrow("Error on signon", e);
		}
	}
	
	@RequestMapping(value = "/team/{teamId}/stats/player", method = RequestMethod.GET)
	@ResponseBody
	public Collection<PlayerStats> getPlayerStats(@PathVariable String teamId,  @RequestParam(value = "gameIds", required = false) String gameIdsAsString, HttpServletRequest request, final HttpServletResponse response) {
		try {
			Team team = service.getTeam(teamId);
			if (team == null) {
				return null;
			} else {
				verifyAccess(team, request);
				this.addStandardExpireHeader(response);  
				List<String> gameIdsToInclude = gameIdsAsString == null ? service.getGameIDs(team) : Arrays.asList(gameIdsAsString.split("_"));
				return new PlayerStatisticsCalculator(service).calculateStats(team, gameIdsToInclude);
			}
		} catch (Exception e) {
			logErrorAndThrow("Error on getPlayerStats", e);
			return null;
		}
	}
	
	@RequestMapping(value = "/team/{teamId}/stats/team", method = RequestMethod.GET)
	@ResponseBody
	public TeamStats getTeamStats(@PathVariable String teamId, @RequestParam(value = "gameIds", required = false) String gameIdsAsString, HttpServletRequest request, final HttpServletResponse response) {
		try {
			Team team = service.getTeam(teamId);
			if (team == null) {
				return null;
			} else {
				verifyAccess(team, request);
				this.addStandardExpireHeader(response);  
				List<String> gameIdsToInclude = gameIdsAsString == null ? service.getGameIDs(team) : Arrays.asList(gameIdsAsString.split("_"));
				return new TeamStatisticsCalculator(service).calculateStats(team, gameIdsToInclude);
			}
		} catch (Exception e) {
			logErrorAndThrow("Error on getTeamStats", e);
			return null;
		}
	}
	
	@RequestMapping(value = "/team/{teamId}/stats/all", method = RequestMethod.GET)
	@ResponseBody
	public AllStats getAllStats(@PathVariable String teamId, @RequestParam(value = "gameIds", required = false) String gameIdsAsString, HttpServletRequest request, final HttpServletResponse response) {
		try {
			Team team = service.getTeam(teamId);
			if (team == null) {
				return null;
			} else {
				verifyAccess(team, request);
				this.addStandardExpireHeader(response);  
				List<String> gameIdsToInclude = gameIdsAsString == null ? service.getGameIDs(team) : Arrays.asList(gameIdsAsString.split("_"));
				return new AllStatisticsCalculator(service).calculateStats(team, gameIdsToInclude);
			}
		} catch (Exception e) {
			logErrorAndThrow("Error on getTeamStats", e);
			return null;
		}
	}
	
	@RequestMapping(value = "/team/{teamId}/stats/export", method = RequestMethod.GET)
	public void getRawStatsExport(@PathVariable String teamId, @RequestParam(value = "gameIds", required = false) String gameIdsAsString, HttpServletRequest request, final HttpServletResponse response) {
		try {
			Team team = service.getTeam(teamId);
			if (team != null) {
				verifyAccess(team, request);
				this.addStandardExpireHeader(response);  
				List<String> gameIdsToInclude = gameIdsAsString == null ? service.getGameIDs(team) : Arrays.asList(gameIdsAsString.split("_"));
				response.setContentType("application/x-download");
				String safeName = StringUtils.deleteWhitespace(team.getName());
				safeName = StringUtils.replaceChars(safeName, "`~!@#$%^&*()+=[]{}:;'\"<>?,./|\\", "-");
				response.setHeader( "Content-Disposition", "attachment; filename=\"" + safeName + "-stats.csv\"" );
				new RawStatisticsExporter(service).writeStats(response.getWriter(), team, gameIdsToInclude);
			}
		} catch (Exception e) {
			logErrorAndThrow("Error on getRawStatsExport", e);
		}
	}

}
