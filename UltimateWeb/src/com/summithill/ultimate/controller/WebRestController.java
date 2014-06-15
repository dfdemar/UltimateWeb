package com.summithill.ultimate.controller;

import static java.util.logging.Level.SEVERE;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.io.Writer;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.multiaction.NoSuchRequestHandlingMethodException;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.appengine.api.users.UserServiceFactory;
import com.summithill.ultimate.model.Game;
import com.summithill.ultimate.model.Player;
import com.summithill.ultimate.model.State;
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
	private static final int MAX_DAYS_FOR_RECENT_GAMES = 90;

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
	public List<ParameterTeam> getTeamsForUser(HttpServletRequest request) {
		return getParameterTeamsForUser(request);
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
	
	@RequestMapping(value = "/teams/all", method = RequestMethod.GET)
	@ResponseBody
	public List<ParameterTeamInfo> getAllTeams(HttpServletRequest request) {
		return getAllParameterTeamInfos();
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
		return getParameterGames(teamId, request, true, false);
	}
	
	@RequestMapping(value = "/team/{teamId}/gamesdata", method = RequestMethod.GET)
	public void getGamesData(@PathVariable String teamId, HttpServletRequest request, HttpServletResponse response) throws IOException, NoSuchRequestHandlingMethodException {
		this.addStandardExpireHeader(response);
		response.setContentType("application/json");
		List<ParameterGame> games = getParameterGames(teamId, request, true, true);
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
		return getParameterGames(teamId, request);
	}
	
	@RequestMapping(value = "/support/team/{teamId}/games", method = RequestMethod.GET)
	@ResponseBody
	public List<ParameterGame> getGamesForSupport(@PathVariable String teamId, HttpServletRequest request, HttpServletResponse response)  throws NoSuchRequestHandlingMethodException{
		this.addStandardExpireHeader(response);
		return getParameterGames(teamId, request, false, false);
	}
	
	@RequestMapping(value = "/team/{teamId}/game/{gameId}", method = RequestMethod.GET)
	@ResponseBody
	public ParameterGame getGame(@PathVariable String teamId, @PathVariable String gameId, HttpServletRequest request)  throws NoSuchRequestHandlingMethodException {
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
			Team team = service.getTeam(teamId);
			if (team == null) {
				throw new RuntimeException("Team " + teamId + " not found");
			} else {
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
				Game game = service.getGame(team, gameId);
				service.deleteGame(userIdentifier, game);
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
				team.setPassword("REMOVE-PASSWORD".equals(password) ? null : password);
				service.saveTeam(userIdentifier, team);
			}
		} catch (Exception e) {
			logErrorAndThrow(userIdentifier, "Error on setTeamPassword", e);
		}
	}
	
	@RequestMapping(value = "/team/{teamId}/state/{stateType}", method = RequestMethod.POST)
	@ResponseBody
	public String saveState(@PathVariable String teamId, @PathVariable String stateType, @RequestBody String stateJson) {
		try {
			Team team = service.getTeam(teamId);
			if (team == null) {
				throw new RuntimeException("Team " + teamId + " not found");
			} else {
				State state = new State(team, stateType, stateJson);
				return service.saveState(state);
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
			logErrorAndThrow("Error on g", e);
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
	
	@RequestMapping(value = "/team/{teamId}/export/game/{gameId}", method = RequestMethod.GET)
	public void getGameExport(@PathVariable String teamId, @PathVariable String gameId, HttpServletRequest request, final HttpServletResponse response) {
		try {
			ParameterTeam team = getParameterTeamAfterVerifyingWebsiteAccess(teamId, request);
			ParameterGame game = getParameterGame(teamId, gameId, request, true);
			String email = UserServiceFactory.getUserService().getCurrentUser().getEmail();
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
	public String uploadGameExport(@PathVariable String teamId, @RequestParam("file") MultipartFile file, @RequestParam(value = "return", required = true) String returnUrl, HttpServletRequest request) {
		Team team = service.getTeam(teamId);
		
		// get team and verify access
		try {
			team = service.getTeam(teamId);
			if (team != null) {
				verifyAccess(team, request);
			}
		} catch (Exception e) {
			logErrorAndThrow("Error on getGameExport", e);
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

	private void renamePlayerForTeam(String userIdentifier, Team team, String oldPlayerName, String newPlayerName) {
		List<String> gameIds = service.getGameIDs(team);
		for (String gameId : gameIds) {
			Game game = service.getGame(team, gameId);
			game.renamePlayer(oldPlayerName, newPlayerName);
			service.saveGame(userIdentifier, game);
		}
	}
	
	private void importGame(String userIdentifier, Team toTeam, GameExport gameExport) throws Exception {
		ParameterGame parameterGame = new ObjectMapper().readValue(gameExport.getGameJson(), ParameterGame.class);
		Game game = new Game(toTeam);
		parameterGame.copyToGame(game);
		game.setGameId("game-" + UUID.randomUUID());  // give it a unique ID
		service.saveGame(userIdentifier, game);
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
		String safeName = StringUtils.deleteWhitespace(s);
		safeName = StringUtils.replaceChars(safeName, "`~!@#$%^&*()+=[]{}:;'\"<>?,./|\\", "-");
		try {
			safeName =  java.net.URLEncoder.encode(safeName, "UTF-8");
		} catch (UnsupportedEncodingException e) {
			// no-op
		}
		return safeName.length() > max ? safeName.substring(0, 60) : safeName;
	}
}
