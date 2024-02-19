package com.summithill.ultimate.controller;

import static java.util.logging.Level.SEVERE;

import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.io.Writer;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.mvc.multiaction.NoSuchRequestHandlingMethodException;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.summithill.ultimate.model.Game;
import com.summithill.ultimate.model.GameVersion;
import com.summithill.ultimate.model.Player;
import com.summithill.ultimate.model.State;
import com.summithill.ultimate.model.Team;
import com.summithill.ultimate.service.GameVersionInfo;
import com.summithill.ultimate.statistics.AllStatisticsCalculator;
import com.summithill.ultimate.statistics.AllStats;
import com.summithill.ultimate.statistics.Anonymizer;
import com.summithill.ultimate.statistics.PlayerStatisticsCalculator;
import com.summithill.ultimate.statistics.PlayerStats;
import com.summithill.ultimate.statistics.RawStatisticsExporter;
import com.summithill.ultimate.statistics.TeamStatisticsCalculator;
import com.summithill.ultimate.statistics.TeamStats;

@Controller
@RequestMapping("/view")
public class WebRestController extends AbstractController {
	private static final int MAX_DAYS_FOR_RECENT_GAMES = 90;
	
	@RequestMapping(value = "/admin/user", method = RequestMethod.GET)
	@ResponseBody
	public ParameterUser getAdminUser(HttpServletRequest request, HttpServletResponse response)  throws NoSuchRequestHandlingMethodException {
		this.addStandardExpireHeader(response);
		String email = getUserEmail(request);
		return new ParameterUser(email);
	}

	@RequestMapping(value = "/team/{id}", method = RequestMethod.GET)
	@ResponseBody
	public ParameterTeam getTeam(@PathVariable String id, HttpServletRequest request, HttpServletResponse response)  throws NoSuchRequestHandlingMethodException {
		this.addStandardExpireHeader(response);
		return getParameterTeamAfterVerifyingWebsiteAccess(id, request);
	}
	
	@RequestMapping(value = "/admin/team/{id}", method = RequestMethod.GET)
	@ResponseBody
	public ParameterTeam getTeamForAdmin(@PathVariable String id, @RequestParam(value = "includePassword", required = false) boolean includePassword, HttpServletRequest request, HttpServletResponse response)  throws NoSuchRequestHandlingMethodException {
		this.addStandardExpireHeader(response);
		if (includePassword) {
			this.verifyAdminUser(request);
		}
		return getParameterTeam(id, request, true);
	}
	
	@RequestMapping(value = "/teams", method = RequestMethod.GET)
	@ResponseBody
	public List<ParameterTeam> getTeamsForUser(HttpServletRequest request, @RequestParam(value = "includeDeleted", required = false, defaultValue = "false") boolean includeDeleted) {
		return getParameterTeamsForUser(request, includeDeleted);
	}
	
	@RequestMapping(value = "/teams/anyuser", method = RequestMethod.POST)
	@ResponseBody
	public Collection<ParameterTeam> getTeams(@RequestBody String[] teamIds, @RequestParam(value = "includePlayers", required = false) boolean includePlayers)  {	
		try {
			Collection<Team> teams = service.getTeams(Arrays.asList(teamIds), true);
			List<ParameterTeam> results = new ArrayList<ParameterTeam>();
			for (Team team : teams) {
				ParameterTeam pTeam = ParameterTeam.fromTeam(team);
				results.add(pTeam);
				if (team.hasPassword()) {
					pTeam.setPassword(null); // don't let consumer see password
				} else {
					if (includePlayers) {
						List<Player> players = service.getPlayers(team);
						List<ParameterPlayer> paramPlayers = new ArrayList<ParameterPlayer>();
						for (Player player : players) {
							paramPlayers.add(ParameterPlayer.fromPlayer(player));
						}
						pTeam.setPlayers(paramPlayers);
					}
				}
			}
			return results;
		} catch (Exception e) {
			logErrorAndThrow("Error on getTeams", e);
			return null;
		}
	}
	
	@RequestMapping(value = "/games/stats", method = RequestMethod.POST)
	@ResponseBody
	public Collection<ParameterTeamGameStats> getGamesStats(@RequestBody ParameterTeamGames[] teamGames)  {	
		try {
			List<ParameterTeamGameStats> results = new ArrayList<ParameterTeamGameStats>();
			for (int i = 0; i < teamGames.length; i++) {
				String teamId = teamGames[i].getTeamId();
				Team team = service.getTeam(teamId);
				ParameterTeamGameStats teamGameStats = new ParameterTeamGameStats();
				ArrayList<ParameterGamePlayerStatistics> statsForGames = new ArrayList<ParameterGamePlayerStatistics>();
				teamGameStats.setStatsForGames(statsForGames);
				teamGameStats.setTeamId(teamId);
				for (String gameId : teamGames[i].getGameIds()) {
					ParameterGamePlayerStatistics playerGameStats = new ParameterGamePlayerStatistics();
					playerGameStats.setGameId(gameId);
					List<String> gameIds = new ArrayList<String>();
					gameIds.add(gameId);
					Collection<PlayerStats> playerStats = new PlayerStatisticsCalculator(service).calculateStats(team, gameIds);
					playerGameStats.setPlayerStats(playerStats);
					statsForGames.add(playerGameStats);
				}
				results.add(teamGameStats);
			}
			return results;
		} catch (Exception e) {
			logErrorAndThrow("Error on getGamesStats", e);
			return null;
		}
	}
	
	@RequestMapping(value = "/teams/all", method = RequestMethod.GET)
	@ResponseBody
	public List<ParameterTeamInfo> getAllTeams(HttpServletRequest request, @RequestParam(value = "skip-deleted", required = false) boolean filterDeleted){
		return getAllParameterTeamInfos(filterDeleted);
	}
	
	@RequestMapping(value = "/games", method = RequestMethod.GET)
	@ResponseBody
	public List<ParameterGame> getGamesSince(@RequestParam(value = "days", required = true) int numberOfDays, @RequestParam(value = "max", required = false) Integer maxResults) {
		return getParameterGamesSince(Math.min(numberOfDays, MAX_DAYS_FOR_RECENT_GAMES), maxResults == null ? Integer.MAX_VALUE : maxResults);
	}
	
	@RequestMapping(value = "/team/{teamId}/players", method = RequestMethod.GET)
	@ResponseBody
	public List<ParameterPlayer> getPlayers(@PathVariable String teamId, HttpServletRequest request, @RequestParam(value = "includeInactive", required = false) boolean includeInactive) {
		try {
			Team team = service.getTeam(teamId);
			if (team == null) {
				return null;
			} else {
				verifyAccess(team, request);
				return getParameterPlayers(team, includeInactive);
			}
		} catch (Exception e) {
			logErrorAndThrow("Error on getPlayers", e);
			return null;
		}
	}
	
	@RequestMapping(value = "/team/{teamId}/games", method = RequestMethod.GET)
	@ResponseBody
	public List<ParameterGame> getGames(@PathVariable String teamId, HttpServletRequest request, HttpServletResponse response)  throws NoSuchRequestHandlingMethodException {
		this.addStandardExpireHeader(response);
		return getParameterGames(teamId, request, true, false, false);
	}
	
	@RequestMapping(value = "/team/{teamId}/gamesdata", method = RequestMethod.GET)
	public void getGamesData(@PathVariable String teamId, HttpServletRequest request, HttpServletResponse response) throws IOException, NoSuchRequestHandlingMethodException {
		this.addStandardExpireHeader(response);
		response.setContentType("application/json");
		List<ParameterGame> games = getParameterGames(teamId, request, true, true, false);
		ObjectMapper jsonMapper = new ObjectMapper();
		jsonMapper.configure(JsonGenerator.Feature.AUTO_CLOSE_TARGET, false);
		Writer responseWriter = response.getWriter();
		responseWriter.write("[");
		String separator = "";
		for (ParameterGame parameterGame : games) {
			responseWriter.write(separator);
			jsonMapper.writeValue(responseWriter, parameterGame);
			separator = ",";
		}
		responseWriter.write("]");
	}
	
	@RequestMapping(value = "/admin/team/{teamId}/games", method = RequestMethod.GET)
	@ResponseBody
	public List<ParameterGame> getGamesForAdmin(@PathVariable String teamId, HttpServletRequest request, HttpServletResponse response)  throws NoSuchRequestHandlingMethodException{
		this.addStandardExpireHeader(response);
		return getParameterGames(teamId, request, false, false, true);
	}
	
	@RequestMapping(value = "/support/team/{teamId}/games", method = RequestMethod.GET)
	@ResponseBody
	public List<ParameterGame> getGamesForSupport(@PathVariable String teamId, @RequestParam(value = "sinceUtc", required = false) String utcDateInclusive, HttpServletRequest request, HttpServletResponse response)  throws NoSuchRequestHandlingMethodException{
		this.addStandardExpireHeader(response);
		return getParameterGamesForSupportSince(teamId, utcDateInclusive, request);
	}
	
	@RequestMapping(value = "/team/{teamId}/game/{gameId}", method = RequestMethod.GET)
	@ResponseBody
	public ParameterGame getGame(@PathVariable String teamId, @PathVariable String gameId, HttpServletRequest request)  throws NoSuchRequestHandlingMethodException {
		return getParameterGame(teamId, gameId, request, true);
	}
	
	@RequestMapping(value = "/team/{teamId}/game/{gameId}/versions", method = RequestMethod.GET)
	@ResponseBody
	public List<ParameterGameVersion> getGameVersions(@PathVariable String teamId, @PathVariable String gameId, HttpServletRequest request, HttpServletResponse response)  throws NoSuchRequestHandlingMethodException {
		try {
			addStandardExpireHeader(response);
			Team team = service.getTeam(teamId);
			if (team == null) {
				throw new NoSuchRequestHandlingMethodException(request);
			} else {
				verifyAdminUserAccessToTeam(request, teamId);
				Game game = service.getGame(team, gameId);
				List<GameVersionInfo> gameVersions = service.getGameVersionInfos(game);
				List<ParameterGameVersion> pGameVersions = new ArrayList<ParameterGameVersion>();
				for (GameVersionInfo gameVersionInfo : gameVersions) {
					ParameterGameVersion pGameVersion = ParameterGameVersion.fromGameVersionInfo(gameVersionInfo);
					if (game.getLastUpdateHash() != null && game.getLastUpdateHash().equals(gameVersionInfo.getUpdateHash())) {
						pGameVersion.setCurrentVersion(true);
					}
					pGameVersions.add(pGameVersion);
				}
				return pGameVersions;
			}
		} catch (NoSuchRequestHandlingMethodException e) {  // 404
			throw e;  // 404
		} catch (Exception e) {
			logErrorAndThrow("Error on getGameVersions", e);
			return null;
		}
	}
	
	@RequestMapping(value = "/team/{teamId}/game/{gameId}/version/{versionId}/restore", method = RequestMethod.POST)
	@ResponseBody
	public void restoreGameVersion(@PathVariable String teamId, @PathVariable String gameId, @PathVariable Long versionId, HttpServletRequest request) {
		String userIdentifier = getUserIdentifier(request);
		try {
			Team team = service.getTeam(teamId);
			if (team == null) {
				throw new RuntimeException("Team " + teamId + " not found");
			} else {
				verifyAdminUserAccessToTeam(request, teamId);
				Game game = service.getGame(team, gameId);
				if (game == null) {
					throw new RuntimeException("Game " + gameId + " not found");
				} else {
					GameVersion gameVersion = service.getGameVersion(game, versionId);
					if (gameVersion == null) {
						throw new RuntimeException("GameVersion " + versionId + " not found for Game " + game.getGameId());
					} else {
						GameExport gameExport = new ObjectMapper().readValue(gameVersion.getExportData(), GameExport.class);
						ParameterGame parameterGame = new ObjectMapper().readValue(gameExport.getGameJson(), ParameterGame.class);
						parameterGame.copyToGame(game);
						game.setLastUpdateUtc(gameVersion.getUpdateUtc());
						game.resetHash();
						service.saveGame(userIdentifier, game, false, null);
					}
				}
			}
		} catch (Exception e) {
			logErrorAndThrow(userIdentifier, "Error on restoreGameVersion", e);
		}
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
				verifyAdminUserAccessToTeam(request, teamId);
				team.setDeleted(true);
				service.saveTeam(userIdentifier, team);
			}
		} catch (Exception e) {
			logErrorAndThrow(userIdentifier, "Error on deleteTeam", e);
		}
	}
	
	@RequestMapping(value = "/team/{teamId}/undelete", method = RequestMethod.POST)
	@ResponseBody
	public void undeleteTeam(@PathVariable String teamId, HttpServletRequest request) {
		//if (true) {throw new UnauthorizedException();} 
		String userIdentifier = getUserIdentifier(request);
		try {
			Team team = service.getTeam(teamId);
			if (team == null) {
				throw new RuntimeException("Team " + teamId + " not found");
			} else {
				verifyAdminUserAccessToTeam(request, teamId);
				team.setDeleted(false);
				service.saveTeam(userIdentifier, team);
			}
		} catch (Exception e) {
			logErrorAndThrow(userIdentifier, "Error on undeleteTeam", e);
		}
	}
	
	@RequestMapping(value = "/team/{teamId}/player/delete", method = RequestMethod.POST)
	@ResponseBody
	public void deletePlayer(@PathVariable String teamId, @RequestParam(value = "player", required = true) String playerToDelete, 
			@RequestParam(value = "replacement", required = true) String replacement, HttpServletRequest request) {
		String userIdentifier = getUserIdentifier(request);
		try {
			Team team = service.getTeam(teamId);
			if (team == null) {
				throw new RuntimeException("Team " + teamId + " not found");
			} else {
				verifyAdminUserAccessToTeam(request, teamId);
				renamePlayerForTeam(userIdentifier, team, playerToDelete, replacement);
				service.deletePlayer(team, playerToDelete);
			}
		} catch (Exception e) {
			logErrorAndThrow(userIdentifier, "Error on deletePlayer", e);
		}
	}
	
	// NOTE: a rename and a merge are equivalent!
	@RequestMapping(value = "/team/{teamId}/player/rename", method = RequestMethod.POST)
	@ResponseBody
	public void renamePlayer(@PathVariable String teamId, 
			@RequestParam(value = "player", required = true) String playerToRename, 
			@RequestParam(value = "replacement", required = true) String replacement, 
			@RequestParam(value = "firstName", required = false) String firstName, 
			@RequestParam(value = "lastName", required = false) String lastName,
			HttpServletRequest request) {
		String userIdentifier = getUserIdentifier(request);
		try {
			verifyAdminUserAccessToTeam(request, teamId);
			Team team = service.getTeam(teamId);
			if (team == null) {
				throw new RuntimeException("Team " + teamId + " not found");
			} else {
				verifyAdminUserAccessToTeam(request, teamId);
				// fix the name in game data
				renamePlayerForTeam(userIdentifier, team, playerToRename, replacement);
				
				// fix the name in the team players list
				List<Player> players = service.getPlayers(team);
				for (Player player : players) {
					if (player.getName().equals(playerToRename)) {
						player.setName(replacement);
						player.setFirstName(firstName);
						player.setLastName(lastName);
						break;
					}
				}
				service.savePlayers(userIdentifier, team, players);
			}
		} catch (Exception e) {
			logErrorAndThrow(userIdentifier, "Error on renamePlayer", e);
		}
	}
	
	// this is a master admin method (allows site admin to copy a team for support purposes)
	// only master admin has security rights for this
	@RequestMapping(value = "/team/{teamId}/supportcopy", method = RequestMethod.POST)
	@ResponseBody
	public void copyTeamToSupportUser(@PathVariable String teamId, HttpServletRequest request) {
		//if (true) {throw new UnauthorizedException();} 
		String userIdentifier = getUserIdentifier(request);
		try {
			Team team = service.getTeam(teamId);
			if (team == null) {
				throw new RuntimeException("Team " + teamId + " not found");
			} else {
				service.copyTeam(userIdentifier, teamId);
			}
		} catch (Exception e) {
			logErrorAndThrow(userIdentifier, "Error on copyTeamToSupportUser", e);
		}
	}
	
	// this will force the teams to recalculate their summary values
//	@RequestMapping(value = "/special/forceteamsummarycalc", method = RequestMethod.GET)
//	@ResponseBody
//	public void forceTeamSummariesRecalc() {
//		service.forceUpdateAllTeamsSummaryData(false);
//	}
	
	@RequestMapping(value = "/team/{teamId}/game/{gameId}/delete", method = RequestMethod.POST)
	@ResponseBody
	public void deleteGame(@PathVariable String teamId, @PathVariable String gameId, HttpServletRequest request) {
		String userIdentifier = getUserIdentifier(request);
		try {
			Team team = service.getTeam(teamId);
			if (team == null) {
				throw new RuntimeException("Team " + teamId + " not found");
			} else {
				verifyAdminUserAccessToTeam(request, teamId);
				service.deleteGameVirtually(userIdentifier, team, gameId, true);
			}
		} catch (Exception e) {
			logErrorAndThrow(userIdentifier, "Error on deleteGame", e);
		}
	}
	
	@RequestMapping(value = "/team/{teamId}/game/{gameId}/undelete", method = RequestMethod.POST)
	@ResponseBody
	public void undeleteGame(@PathVariable String teamId, @PathVariable String gameId, HttpServletRequest request) {
		String userIdentifier = getUserIdentifier(request);
		try {
			Team team = service.getTeam(teamId);
			if (team == null) {
				throw new RuntimeException("Team " + teamId + " not found");
			} else {
				verifyAdminUserAccessToTeam(request, teamId);
				service.deleteGameVirtually(userIdentifier, team, gameId, false);
			}
		} catch (Exception e) {
			logErrorAndThrow(userIdentifier, "Error on undeleteGame", e);
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
				verifyAdminUserAccessToTeam(request, teamId);
				team.setPassword("REMOVE-PASSWORD".equals(password) ? null : password);
				service.saveTeam(userIdentifier, team);
			}
		} catch (Exception e) {
			logErrorAndThrow(userIdentifier, "Error on setTeamPassword", e);
		}
	}
	
	@RequestMapping(value = "/team/{teamId}/state/{stateType}", method = RequestMethod.POST)
	@ResponseBody
	public ParameterState saveState(@PathVariable String teamId, @PathVariable String stateType, @RequestBody String stateJson) {
		try {
			Team team = service.getTeam(teamId);
			if (team == null) {
				throw new RuntimeException("Team " + teamId + " not found");
			} else {
				State state = new State(team, stateType, stateJson);
				service.saveState(state);
				ParameterState pState = ParameterState.fromState(state);
				pState.setJson(null); // don't return the same thing we just got
				pState.setTeamNameWithSeason(team.getNameWithSeason());
				return pState;
			}
		} catch (Exception e) {
			logErrorAndThrow("Error on saveState", e);
			return null;
		}
	}
	
	@RequestMapping(value = "/team/{teamId}/state/{stateType}/{stateId}", method = RequestMethod.GET)
	@ResponseBody
	public ParameterState getState(@PathVariable String stateId, @PathVariable String stateType, HttpServletRequest request, @RequestParam(value = "meta", required = false) boolean metaOnly) {
		try {
			State state = service.getState(stateId);
			if (state == null || !state.getType().equals(stateType)) {
				throw new ResourceNotFoundException();
			} else {
				Team team = service.getTeam(state.getTeamId());
				if (team == null) {
					throw new ResourceNotFoundException();
				}
				ParameterState pState = ParameterState.fromState(state);
				pState.setTeamPrivate(team.hasPassword());
				pState.setTeamNameWithSeason(team.getNameWithSeason());
				if (metaOnly) {
					pState.setJson(null);
					return pState;
				} else {
					if (pState.isTeamPrivate()) {
						this.verifyAccess(team, request);
					}
					return pState;
				}
			}
		} catch (ResourceNotFoundException e) {
			throw e;
		} catch (Exception e) {
			logErrorAndThrow("Error on getState", e);
			return null;
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
					addPasswordHashCustomHeader(response, team);
				} else {
					throw new PasswordRequiredException();
				}
			}
		} catch (Exception e) {
			logErrorAndThrow("Error on signon", e);
		}
	}
	
	// returns the aggregated stats for each game
	@RequestMapping(value = "/team/{teamId}/stats/player", method = RequestMethod.GET)
	@ResponseBody
	public Collection<PlayerStats> getPlayerStats(@PathVariable String teamId,  @RequestParam(value = "gameIds", required = false) String gameIdsAsString, HttpServletRequest request, final HttpServletResponse response) throws NoSuchRequestHandlingMethodException {
		try {
			Team team = service.getTeam(teamId);
			if (team == null) {
				throw new NoSuchRequestHandlingMethodException(request);
			} else {
				verifyAccess(team, request);
				this.addStandardExpireHeader(response);  
				List<String> gameIdsToInclude = gameIdsAsString == null ? service.getGameIDs(team) : Arrays.asList(gameIdsAsString.split("_"));
				return new PlayerStatisticsCalculator(service).calculateStats(team, gameIdsToInclude);
			}
		} catch (NoSuchRequestHandlingMethodException e) {
			throw e;
		} catch (Exception e) {
			logErrorAndThrow("Error on getPlayerStats", e);
			return null;
		}
	}
	
	// returns the aggregated player stats for all games for the teams listed
	@RequestMapping(value = "/teams/stats/player", method = RequestMethod.POST)
	@ResponseBody
	public Collection<TeamPlayerStats> getPlayerStatsForTeams(@RequestBody String[] teamIds)  {	
		try {
			Collection<Team> teams = service.getTeams(Arrays.asList(teamIds), true);
			ObjectMapper mapper = new ObjectMapper();
			List<TeamPlayerStats> results = new ArrayList<TeamPlayerStats>();
			for (Team team : teams) {
				TeamPlayerStats teamPlayerStats = new TeamPlayerStats(team.getTeamId());
				results.add(teamPlayerStats);
				if (team.hasPassword()) {
					teamPlayerStats.setPrivate(true);
				} else {
					List<String> gameIdsToInclude = service.getGameIDs(team);
					Collection<PlayerStats> playerStats = new PlayerStatisticsCalculator(service).calculateStats(team, gameIdsToInclude);
					String playerStatsJson = mapper.writeValueAsString(playerStats);
					teamPlayerStats.setPlayerStatsJson(playerStatsJson);
				}
			}
			return results;
		} catch (Exception e) {
			logErrorAndThrow("Error on getPlayerStatsForTeams", e);
			return null;
		}
	}
	
	// returns the stats for each game
	@RequestMapping(value = "/team/{teamId}/stats/player/games", method = RequestMethod.GET)
	@ResponseBody
	public Collection<ParameterGamePlayerStats> getPlayerStatsForEachGame(@PathVariable String teamId,  @RequestParam(value = "gameIds", required = false) String gameIdsAsString, HttpServletRequest request, final HttpServletResponse response) throws NoSuchRequestHandlingMethodException {
		try {
			Team team = service.getTeam(teamId);
			if (team == null) {
				throw new NoSuchRequestHandlingMethodException(request);
			} else {
				verifyAccess(team, request);
				this.addStandardExpireHeader(response);  
				List<String> gameIdsToInclude = gameIdsAsString == null ? service.getGameIDs(team) : Arrays.asList(gameIdsAsString.split("_"));
				List<ParameterGamePlayerStats> gamePlayerStats = new ArrayList<ParameterGamePlayerStats>();
				ObjectMapper mapper = new ObjectMapper();
				for (String gameId : gameIdsToInclude) {
					List<String> singleGameIdList = new ArrayList<String>();
					singleGameIdList.add(gameId);
					Collection<PlayerStats> playerStats = new PlayerStatisticsCalculator(service).calculateStats(team, singleGameIdList);
					String playerStatsJson = mapper.writeValueAsString(playerStats);
					gamePlayerStats.add(new ParameterGamePlayerStats(gameId, playerStatsJson));
				}
				return gamePlayerStats;
			}
		} catch (NoSuchRequestHandlingMethodException e) {
			throw e;
		} catch (Exception e) {
			logErrorAndThrow("Error on getPlayerStatsForEachGame", e);
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
			logErrorAndThrow("Error on getAllStats", e);
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
				try {
					safeName =  java.net.URLEncoder.encode(safeName, "UTF-8");
				} catch (UnsupportedEncodingException e) {
					// no-op
				}
				response.setHeader( "Content-Disposition", "attachment; filename=\"" + safeName + "-stats.csv\"" );
				new RawStatisticsExporter(service).writeStats(response.getWriter(), team, gameIdsToInclude);
			}
		} catch (Exception e) {
			logErrorAndThrow("Error on getRawStatsExport", e);
		}
	}
	
	@RequestMapping(value = "/team/{teamId}/stats/export/anonymized", method = RequestMethod.GET)
	public void getRawStatsExportAnonymized(@PathVariable String teamId, HttpServletRequest request, final HttpServletResponse response) {
		try {
			Team team = service.getTeam(teamId);
			if (team != null) {
				this.addStandardExpireHeader(response);  
				response.setContentType("text/plain");
				Writer responseWriter = response.getWriter();
				writeAnonymizedGameData(team, responseWriter);
			}
		} catch (Exception e) {
			logErrorAndThrow("Error on getRawStatsExportAnonymized", e);
		}
	}
	
	@RequestMapping(value = "/team/{teamId}/export/game/{gameId}", method = RequestMethod.GET)
	public void getGameExport(@PathVariable String teamId, @PathVariable String gameId, HttpServletRequest request, final HttpServletResponse response) {
		try {
			verifyAdminUserAccessToTeam(request, teamId);
			ParameterTeam team = getParameterTeam(teamId, request, false, false);
			ParameterGame game = getParameterGame(teamId, gameId, request, false);
			String email = getUserEmail(request);
			GameExport export = GameExport.from(team, game, email); 
			
			this.addStandardExpireHeader(response);  
			response.setContentType("application/x-download");
			String safeName = createGameExportFileName(teamId, team, game);
			response.setHeader( "Content-Disposition", "attachment; filename=\"" + safeName + ".iexport\"" );
			export.writeJsonString(response.getWriter());
		} catch (Exception e) {
			logErrorAndThrow("Error on getGameExport", e);
		}
	}
	
	// this is a master admin method (allows site admin to export a game for backup purposes)
	// only master admin has security rights for this
	@RequestMapping(value = "/support/team/{teamId}/export/game/{gameId}", method = RequestMethod.GET)
	public void getGameExportForSupport(@PathVariable String teamId, @PathVariable String gameId, HttpServletRequest request, final HttpServletResponse response) {
		try {
			Team team = service.getTeam(teamId);
			ParameterTeam pTeam = getParameterTeam(teamId, request, true, false);
			ParameterGame game = getParameterGame(teamId, gameId, request, false);
			GameExport export = GameExport.from(pTeam, game, null, team.getUserIdentifier()); 
			
			this.addStandardExpireHeader(response);  
			response.setContentType("application/json");
			export.writeJsonString(response.getWriter());
		} catch (Exception e) {
			logErrorAndThrow("Error on getGameExportForSupport", e);
		}
	}

	@RequestMapping(value = "/team/{teamId}/import/game", method = RequestMethod.POST)
	@ResponseBody
	public String uploadGameExportOLD(@PathVariable String teamId, @RequestParam("file") MultipartFile file, @RequestParam(value = "return", required = true) String returnUrl, HttpServletRequest request) {
		Team team = service.getTeam(teamId);
		
		// get team and verify access
		try {
			team = service.getTeam(teamId);
			if (team != null) {
				verifyAdminUserAccessToTeam(request, teamId);
			}
		} catch (Exception e) {
			logErrorAndThrow("Error on uploadGameExportOLD", e);
		}
		
		
		// import the game found in the file
		try {
	        if (!file.isEmpty()) {
	           String userIdentifier = getUserIdentifier(request);
	           GameExport gameExport = new ObjectMapper().readValue(file.getBytes(), GameExport.class);
	           if (!gameExport.getHash().equals("666")) { // don't verify the hash if special code
	        	   if (!gameExport.verifyHash()) {
	        		   return fileUploadResponseHtml("Game import FAILED...Attempting to import a file which is corrupt or altered since export", returnUrl);
	        	   }
	           }
	           importGame(userIdentifier, team, gameExport);
	           importPlayers(userIdentifier, team, gameExport);
	       } else {
	    	   return fileUploadResponseHtml("Game import FAILED...No file included in request for import", returnUrl);
	       }
			return fileUploadResponseHtml("Game imported successsfully", returnUrl);
		} catch (Exception e) {
			log.log(SEVERE, "Error on game import", e);
			return fileUploadResponseHtml("Game import FAILED...Attempting to import a file which is corrupt or not originally exported from UltiAnalytics", returnUrl);
		}
	}
	
	@RequestMapping(value = "/team/{teamId}/import2/game", method = RequestMethod.POST, produces = {"application/json"})
	@ResponseBody
	public HashMap<String, Object> uploadGameExport(@PathVariable String teamId, MultipartHttpServletRequest request, HttpServletResponse response) {
		Team team = service.getTeam(teamId);
		
		// get team and verify access
		try {
			team = service.getTeam(teamId);
			if (team != null) {
				verifyAdminUserAccessToTeam(request, teamId);
			}
		} catch (Exception e) {
			logErrorAndThrow("Error on uploadGameExport", e);
		}

		try {
			// import the game found in the file
	        MultipartFile multipartFile = request.getFile("file");
	        InputStream stream = multipartFile.getInputStream();
	        byte[] fileBytes = IOUtils.toByteArray(stream);
	        if (fileBytes.length != 0) {
	           String userIdentifier = getUserIdentifier(request);
	           GameExport gameExport = new ObjectMapper().readValue(fileBytes, GameExport.class);
	           if (!gameExport.getHash().equals("666")) { // don't verify the hash if special code
	        	   if (!gameExport.verifyHash()) {
	        		   return fileUploadResponseMap("Game import FAILED...Attempting to import a file which is corrupt or altered since export", false);
	        	   }
	           }
	           importGame(userIdentifier, team, gameExport);
	           importPlayers(userIdentifier, team, gameExport);
	        } else {
	    	   return fileUploadResponseMap("Game import FAILED...No file included in request for import", false);
	        }
	        return fileUploadResponseMap("Game imported successsfully", true);
		} catch (Exception e) {
			log.log(SEVERE, "Error on uploadGameExport", e);
			return fileUploadResponseMap("Game import FAILED...Attempting to import a file which is corrupt or not originally exported from UltiAnalytics", false);
		}
	}
	
	private HashMap<String, Object> fileUploadResponseMap(String message, boolean isOK) {
		HashMap<String, Object> responseMap = new HashMap<String, Object>();
		responseMap.put("message", message); 
		responseMap.put("status", isOK ? "ok" : "error");
		return responseMap;
	}
	
	private void renamePlayerForTeam(String userIdentifier, Team team, String oldPlayerName, String newPlayerName) {
		List<String> gameIds = service.getGameIDs(team);
		for (String gameId : gameIds) {
			Game game = service.getGame(team, gameId);
			game.renamePlayer(oldPlayerName, newPlayerName);
			service.saveGame(userIdentifier, game, true, "player rename from " + oldPlayerName + " to " + newPlayerName);
		}
	}
	
	private void importGame(String userIdentifier, Team toTeam, GameExport gameExport) throws Exception {
		ParameterGame parameterGame = new ObjectMapper().readValue(gameExport.getGameJson(), ParameterGame.class);
		Game game = new Game(toTeam);
		parameterGame.copyToGame(game);
		game.setGameId("game-" + UUID.randomUUID());  // give it a unique ID
		service.saveGame(userIdentifier, game, true, "import");
	}
	
	private void importPlayers(String userIdentifier, Team toTeam, GameExport gameExport) throws Exception {
		ParameterTeam parameterTeam = new ObjectMapper().readValue(gameExport.getTeamJson(), ParameterTeam.class);
		List<ParameterPlayer> importedParameterPlayers = parameterTeam.getPlayers();
		List<Player> existingPlayers = service.getPlayers(toTeam);
		List<Player> newPlayers = new ArrayList<Player>(existingPlayers);
		for (ParameterPlayer importedParameterPlayer : importedParameterPlayers) {
			Player importedPlayer = new Player(toTeam, importedParameterPlayer.getName());
			importedParameterPlayer.copyToPlayer(importedPlayer);
			if (!containsPlayer(existingPlayers, importedPlayer)) {
				newPlayers.add(importedPlayer);
			}
		}
		service.savePlayers(userIdentifier, toTeam, newPlayers);
	}
	
	private boolean containsPlayer(List<Player> players, Player player) {
		for (Player listPlayer : players) {
			if (listPlayer.compareTo(player) == 0) {
				return true;
			}
		}
		return false;
	}
	
	private String fileUploadResponseHtml(String message, String returnUrl) {
		String html = "<html><body><br>&nbsp;" + message + "<br><br>&nbsp;<a href=\"" + returnUrl + "\">Return to UltiAnalytics Admin</a></body></html>";
		return html;
	}
	
	private String createGameExportFileName(String teamId, ParameterTeam team,
			ParameterGame game) {
		return "UltiAnalyticsGame_" + 
			fileSafeString(team.getName(),60) + "-" + teamId + "_v_" + 
			fileSafeString(game.getOpponentName(),60) + "_" + game.getTimestamp();
	}
	
	private String fileSafeString(String s, int max) {
		if (s == null) {
			return "";
		}
		String safeName = StringUtils.deleteWhitespace(s);
		safeName = StringUtils.replaceChars(safeName, "`~!@#$%^&*()+=[]{}:;'\"<>?,./|\\", "-");
		try {
			safeName =  java.net.URLEncoder.encode(safeName, "UTF-8");
		} catch (UnsupportedEncodingException e) {
			// no-op
		}
		return safeName.length() > max ? safeName.substring(0, 60) : safeName;
	}
	
	private void writeAnonymizedGameData(Team team, Writer writer) {
		List<Game> games = service.getGames(team, false, false);
		Collections.sort(games, new Game.GameTimestampComparator());
		
		Anonymizer anonymizer = new Anonymizer();
		anonymizer.generateAnonymizedGameDates(games);
		
		RawStatisticsExporter statsExporter = new RawStatisticsExporter(service, team.getTeamId(), anonymizer);

		List<String>gameIds = new ArrayList<String>();
		for (Game game : games) {
			gameIds.add(game.getGameId());
		}
		statsExporter.writeStats(writer, team, gameIds);
	}
	
	protected void handleUnauthorized(HttpServletResponse response) {
		response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
	}
	
    protected boolean isOAuth2Client(HttpServletRequest request) {
    	return hasOAuth2Header(request) || request.getParameter("access_token") != null;
    }
    
    @RequestMapping(value = "/team-callback", method = RequestMethod.POST)
	@ResponseBody
	public void setTeamNotificationUrl(@RequestBody String[] teamIds, @RequestParam(value = "notifyUrl", required = true) String notifyUrl)  {
    	for (String teamId : teamIds) {
    		Team team = null;
    		try {
    			team = service.getTeam(teamId);
    		} catch (Exception e) {
    			logErrorAndThrow("teamId " + teamId + " get error",  e);
    		}
			if (team != null) {
				team.setNotifyUrl(notifyUrl);
				service.saveTeam(team.getUserIdentifier(), team);
				logInfo("teamId " + teamId + " nofityURL updated to " + notifyUrl);
			} else {
				logErrorAndThrow("teamId " + teamId + " not found",  null);
			}
		}
	}

}