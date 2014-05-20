package com.summithill.ultimate.controller;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.multiaction.NoSuchRequestHandlingMethodException;

import com.summithill.ultimate.model.Game;
import com.summithill.ultimate.model.Player;
import com.summithill.ultimate.model.Team;

@Controller
@RequestMapping("/mobile")
public class MobileRestController extends AbstractController {
	private static final String MIN_ACCEPTABLE_APP_IOS_VERSION = "1.0.29";
	private static final String MIN_ACCEPTABLE_APP_ANDROID_VERSION = "1.1.17";
	
	@RequestMapping(value = "/test", method = RequestMethod.GET, headers="Accept=*/*")
	@ResponseBody
	public ParameterTeam getTestTeam(HttpServletRequest request) {
		getUserIdentifier(request);
		ParameterTeam testTeam = new ParameterTeam();
		testTeam.setName("Test");
		return testTeam;
	}
	
	@RequestMapping(value = "/meta/{appVersion}", method = RequestMethod.GET)
	@ResponseBody
	public ParameterMetaInfo getMetaInfo(@PathVariable String appVersion, @RequestParam(value = "mobile-type", required = false) String mobileType) {
		ParameterMetaInfo metaInfo = new ParameterMetaInfo();
		boolean isAndroid = mobileType != null && mobileType.toLowerCase().contains("android");
		String minVersion = isAndroid ? MIN_ACCEPTABLE_APP_ANDROID_VERSION : MIN_ACCEPTABLE_APP_IOS_VERSION;
		if (normalizedVersionString(appVersion).compareTo(normalizedVersionString(minVersion)) < 0) {
			metaInfo.setAppVersionAcceptable(false);
			metaInfo.setMessageToUser("The version of the app you are running on your mobile device is no longer compatible with the server.  Please upgrade the app to the latest version.  \nDon't worry...you won't lose your data as a result of the upgrade!");
		}
		return metaInfo;
	}

	@RequestMapping(value = "/team/{id}", method = RequestMethod.GET)
	@ResponseBody
	public ParameterTeam getTeam(@PathVariable String id, HttpServletRequest request)  throws NoSuchRequestHandlingMethodException {
		getUserIdentifier(request);
		return getParameterTeam(id, request);
	}
	
	@RequestMapping(value = "/teams", method = RequestMethod.GET)
	@ResponseBody
	public List<ParameterTeam> getTeams(HttpServletRequest request) {
		return getParameterTeamsForUser(request);
	}
	
	@RequestMapping(value = "/team/{teamId}/games", method = RequestMethod.GET)
	@ResponseBody
	public List<ParameterGame> getGames(@PathVariable String teamId, HttpServletRequest request)  throws NoSuchRequestHandlingMethodException {
		getUserIdentifier(request);
		return getParameterGames(teamId, request);
	}
	
	@RequestMapping(value = "/team/{teamId}/game/{gameId}", method = RequestMethod.GET)
	@ResponseBody
	public ParameterGame getGame(@PathVariable String teamId, @PathVariable String gameId, HttpServletRequest request)  throws NoSuchRequestHandlingMethodException{
		getUserIdentifier(request);
		return getParameterGame(teamId, gameId, request, false);
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

	private void updatePlayers(String userIdentifier, Team team, List<ParameterPlayer> mobilePlayers) {
		updatePlayerLongNames(team, mobilePlayers);
		Set<ParameterPlayer> paramPlayers = new HashSet<ParameterPlayer>(mobilePlayers);
		addParameterPlayersFromGames(team, paramPlayers);
		List<Player> players = parameterPlayersToModelPlayers(team, paramPlayers);
		service.savePlayers(userIdentifier, team, players);
	}
	
	private void updatePlayerLongNames(Team team, List<ParameterPlayer> paramPlayers) {
		List<Player> players = service.getPlayers(team);
		Map<String, Player> playerLookup = new HashMap<String, Player>();
		for (Player player : players) {
			playerLookup.put(player.getName(), player);
		}
		for (ParameterPlayer pPlayer : paramPlayers) {
			Player existingPlayer = playerLookup.get(pPlayer.getName());
			if (existingPlayer != null) {
				pPlayer.setLongName(existingPlayer.getLongName());
			}
		}
	}

	private void addParameterPlayersFromGames(Team team, Set<ParameterPlayer> paramPlayers) {
		Set<String> playerNamesFromGames = extractPlayerNamesFromGames(team.getTeamId());
		for (String playerName : playerNamesFromGames) {
			if (!playerName.equalsIgnoreCase("Anonymous")) {
				ParameterPlayer playerFromGame = ParameterPlayer.createInactivePlayer(playerName);
				if (!paramPlayers.contains(playerFromGame)) {
					paramPlayers.add(playerFromGame);
				}
			}
		}
	}
	
	public String normalizedVersionString(String version) {
		final String EMPTY_VERSION = "000000000000";
		if (version == null || version.isEmpty()) {
			return EMPTY_VERSION;
		}
		String[] parts = version.contains("_") ? version.split("_") : version.split("\\.");
		if (parts.length != 3) {
			return EMPTY_VERSION;
		}
		String normalizedString = "";
		for (String part : parts) {
			normalizedString += org.apache.commons.lang.StringUtils.leftPad(part, 4, '0');
		}
		return normalizedString;
	}

}
