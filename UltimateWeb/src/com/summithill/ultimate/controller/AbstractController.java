package com.summithill.ultimate.controller;

import static java.util.logging.Level.SEVERE;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Logger;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.mvc.multiaction.NoSuchRequestHandlingMethodException;

import com.google.appengine.api.oauth.OAuthRequestException;
import com.google.appengine.api.oauth.OAuthService;
import com.google.appengine.api.oauth.OAuthServiceFactory;
import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.summithill.ultimate.model.Game;
import com.summithill.ultimate.model.Player;
import com.summithill.ultimate.model.Team;
import com.summithill.ultimate.service.TeamService;

public class AbstractController {
	protected Logger log = Logger.getLogger(MobileRestController.class.getName());
	private final static String PASSWORD_COOKIE_NAME = "iultimate";
	private final static String TEST_TEAM_NAME_MARKER = "@test@";
	
	@Autowired
	protected TeamService service;
	
	@ResponseStatus(value = HttpStatus.UNAUTHORIZED)
	@ExceptionHandler({ UnauthorizedException.class })
	public void handleUnathorizedException(HttpServletResponse response) {
		response.setHeader("WWW-Authenticate","Basic realm=\"UltiAnalytics Protected API\"");
	}
    
	protected ParameterTeam getParameterTeam(@PathVariable String id, HttpServletRequest request) throws NoSuchRequestHandlingMethodException {
		return this.getParameterTeam(id, request, false, false);
	}
	
	protected ParameterTeam getParameterTeam(@PathVariable String id, HttpServletRequest request, boolean includePassword)  throws NoSuchRequestHandlingMethodException {
		return this.getParameterTeam(id, request, includePassword, false);
	}
	
	protected ParameterTeam getParameterTeamAfterVerifyingWebsiteAccess(@PathVariable String id, HttpServletRequest request)  throws NoSuchRequestHandlingMethodException {
		return this.getParameterTeam(id, request, false, true);
	}

	protected ParameterTeam getParameterTeam(@PathVariable String id, HttpServletRequest request, boolean includePassword, boolean verifyWebsitePassword) throws NoSuchRequestHandlingMethodException {
		try {
			boolean includePlayers = "true".equals(request.getParameter("players"));
			boolean includeInactivePlayers = "true".equals(request.getParameter("includeInactive"));
			Team team = service.getTeam(id);
			if (team == null) {
				throw new NoSuchRequestHandlingMethodException(request);
			} else if (team.isDeleted()) {
				return null;
			} else {
				if (verifyWebsitePassword) {
					this.verifyAccess(team, request);
				}
				ParameterTeam pTeam = ParameterTeam.fromTeam(team);
				if (includePlayers) {
					pTeam.setPlayers(getParameterPlayers(team, includeInactivePlayers));
				}
				if (includePassword) {
					pTeam.setPassword(team.getPassword());
				}
				return pTeam;
			}
		} catch (NoSuchRequestHandlingMethodException e) {  
			throw e;	// 404	
		} catch (Exception e) {
			logErrorAndThrow("Error on getTeam", e);
			return null;
		}
	}
	
	protected List<ParameterPlayer> getParameterPlayers(Team team, boolean includeInactive) {
		List<Player> players = service.getPlayers(team);
		Set<ParameterPlayer> paramPlayers = new HashSet<ParameterPlayer>();
		for (Player player : players) {
			paramPlayers.add(ParameterPlayer.fromPlayer(player));
		}
		
		if (includeInactive) {
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
		
		List<ParameterPlayer> answer = new ArrayList<ParameterPlayer>(paramPlayers);
		Collections.sort(answer);
		return answer;
	}
	
	protected List<ParameterTeam> getParameterTeamsForUser(HttpServletRequest request, boolean includeDeleted) {
		String userIdentifier = getUserIdentifier(request);
		try {
			List<ParameterTeam> teamsResponseList = new ArrayList<ParameterTeam>();
			List<Team> teams = service.getTeams(userIdentifier);
			for (Team team : teams) {
				ParameterTeam pTeam = ParameterTeam.fromTeam(team);
				if (includeDeleted || !pTeam.isDeleted()) {
					pTeam.setPassword(team.getPassword());
					teamsResponseList.add(pTeam);
				}
			}
			return teamsResponseList;
		} catch (Exception e) {
			logErrorAndThrow("Error on getParameterTeamsForUser", e);
			return null;
		}
	}
	
	protected List<Player> parameterPlayersToModelPlayers(Team team, Collection<ParameterPlayer> parameterPlayers) {
		List<Player> players = new ArrayList<Player>();
		for (ParameterPlayer mobilePlayer : parameterPlayers) {
			Player player = new Player(team, mobilePlayer.getName());
			mobilePlayer.copyToPlayer(player);
			players.add(player);
		}
		return players;
	}
	
	protected List<ParameterTeamInfo> getAllParameterTeamInfos() {
		try {
			List<ParameterTeamInfo> teamsResponseList = new ArrayList<ParameterTeamInfo>();
			List<Team> teams = service.getAllTeams();
			for (Team team : teams) {
				if (!team.getName().contains(TEST_TEAM_NAME_MARKER)) {
					ParameterTeamInfo pTeam = ParameterTeamInfo.fromTeam(team);
					teamsResponseList.add(pTeam);
				}
			}
			return teamsResponseList;
		} catch (Exception e) {
			logErrorAndThrow("Error on getAllParameterTeamInfos", e);
			return null;
		}
	}
	
	protected List<ParameterGame> getParameterGames(String teamId, HttpServletRequest request,boolean verifyWebsitePassword, boolean includePoints, boolean includeDeleted) throws NoSuchRequestHandlingMethodException {
		try {
			Team team = service.getTeam(teamId);
			if (team == null) {
				throw new NoSuchRequestHandlingMethodException(request);
			} else {
				if (verifyWebsitePassword) {
					this.verifyAccess(team, request);
				}
				// note: assuming that Text objects are not pulled from the DB until referenced.  Therefore we aren't creating a memory burden by reading in a 100 games
				List<Game> games = service.getGames(team, includeDeleted);
				List<ParameterGame> pGames = new ArrayList<ParameterGame>();
					for (Game game : games) {  
						if (!includePoints) {
							game.setPointsJson(null);  // dump the points JSON so we don't include it in the response
						}
						pGames.add(ParameterGame.fromGame(game));
					}
				return pGames;
			}
		} catch (NoSuchRequestHandlingMethodException e) {  
			throw e;  // 404						
		} catch (Exception e) {
			logErrorAndThrow("Error on getGames", e);
			return null;
		}
	}
	
	protected List<ParameterGame> getParameterGamesForSupportSince(String teamId, String utcDateInclusive, HttpServletRequest request) throws NoSuchRequestHandlingMethodException {
		try {
			Team team = service.getTeam(teamId);
			if (team == null) {
				throw new NoSuchRequestHandlingMethodException(request);
			} else {
				List<Game> games = service.getGamesForTeamSince(team, utcDateInclusive);
				List<ParameterGame> pGames = new ArrayList<ParameterGame>();
					for (Game game : games) {
							game.setPointsJson(null);  // dump the points JSON so we don't include it in the response
						pGames.add(ParameterGame.fromGame(game));
					}
				return pGames;
			}
		} catch (NoSuchRequestHandlingMethodException e) {  
			throw e;  // 404						
		} catch (Exception e) {
			logErrorAndThrow("Error on getParameterGamesForSupport", e);
			return null;
		}
	}
	
	protected List<ParameterGame> getParameterGamesSince(int numberOfDays, int max)  {
		try {
			List<Game> games = service.getGamesSince(numberOfDays, max);
			List<Team> teamsForGames = service.getTeamsForGames(games);
			Map<String, Team> teamLookup = new HashMap<String, Team>();
			for (Team team: teamsForGames) {
				teamLookup.put(team.getPersistenceId(), team);
			}
			
			List<ParameterGame> parameterGames = new ArrayList<ParameterGame>();
			for (Game game : games) {
				if (!game.getOpponentName().contains(TEST_TEAM_NAME_MARKER) ) {
					game.setPointsJson(null);  // dump the points JSON so we don't include it in the response
					ParameterGame pGame = ParameterGame.fromGame(game);
					String teamPersistenceId = game.getParentPersistenceId();
					if (teamPersistenceId != null) {
						Team team = teamLookup.get(teamPersistenceId);
						if (team != null && !team.getName().contains(TEST_TEAM_NAME_MARKER) && !team.isDeleted()) {
							pGame.setTeamInfo(ParameterTeamInfo.fromTeam(team));
							parameterGames.add(pGame);
						}
					}
				}
			}
			return parameterGames;
		} catch (Exception e) {
			logErrorAndThrow("Error on getGamesSince", e);
			return null;
		}
	}
	
	protected ParameterGame getParameterGame(String teamId, String gameId, HttpServletRequest request, boolean verifyWebsiteAccess) throws NoSuchRequestHandlingMethodException {
		try {
			Team team = service.getTeam(teamId);
			if (team == null) {
				throw new NoSuchRequestHandlingMethodException(request);
			} else {
				if (verifyWebsiteAccess) {
					verifyAccess(team, request);
				}
				Game game = service.getGame(team, gameId);
				return ParameterGame.fromGame(game);
			}
		} catch (NoSuchRequestHandlingMethodException e) {  // 404
			throw e;  // 404
		} catch (Exception e) {
			logErrorAndThrow("Error on getGame", e);
			return null;
		}
	}
	
	protected void verifyAdminUser(HttpServletRequest request) {
		this.getUserIdentifier(request);
	}
	
	protected void verifyAdminUserAccessToTeam(HttpServletRequest request, String teamId) {
		Team team = service.getTeam(teamId);
		String userIdentifier = this.getUserIdentifier(request);
		if (!team.getUserIdentifier().equals(userIdentifier)) {
			throw new UnauthorizedException();
		}
	}
	
	protected String getUserIdentifier(HttpServletRequest request) {
		//if (true) {throw new UnauthorizedException();} // force authorization error
		if (request.getRequestURL().toString().contains("//local")) {
			return "localtestuser";
		}
		if (isOAuth2Client(request)) {
			try {
		        OAuthService oauth = OAuthServiceFactory.getOAuthService();
		        User user = oauth.getCurrentUser();
		        if (user == null) {
		        	throw new UnauthorizedException();
		        } else {
			        return user.getUserId();
		        }
		    } catch (OAuthRequestException e) {
		    	throw new UnauthorizedException();
		    }
		} else {
			UserService userService = UserServiceFactory.getUserService();
			if (userService != null && userService.isUserLoggedIn()) {
				return userService.getCurrentUser().getUserId();
			} else {
				throw new UnauthorizedException();
			}
		}
	}

	protected void logErrorAndThrow(String message, Throwable t) {
		if (t instanceof UnauthorizedException) {
			throw (UnauthorizedException)t;
		} else if (t instanceof PasswordRequiredException) {
			throw (PasswordRequiredException)t;
		}
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
	
	protected void logRequest(HttpServletRequest req) {
		StringBuffer buf = new StringBuffer("Http Request details:\n");
		buf.append(req.getRequestURL().toString());
		buf.append("\nHeaders:");
		@SuppressWarnings("unchecked")
		Enumeration<String> headerNames = req.getHeaderNames();
		while (headerNames.hasMoreElements()) {
			String headerName = headerNames.nextElement();
			String headerValue = req.getHeader(headerName);
			buf.append("\n");
			buf.append(headerName);
			buf.append(" = ");
			buf.append(headerValue);
		}
		log.log(SEVERE, buf.toString());
	}
	
	protected void addExpireHeader(HttpServletResponse response, long minutesBeforeExpire) {
		response.setDateHeader("Expires", System.currentTimeMillis() + minutesBeforeExpire * 60 * 1000);
	}
	
	protected void addStandardExpireHeader(HttpServletResponse response) {
		this.addExpireHeader(response, 60);
	}

	protected void verifyAccess(Team team, HttpServletRequest request) {
		if (team.hasPassword()) {
			String userEnterdPasswordHash = this.getPasswordCookieValue(request);
			if (userEnterdPasswordHash != null) {
				String correctPasswordHash = this.hashPassword(team, team.getPassword());
				if (correctPasswordHash.equals(userEnterdPasswordHash)) {
					return;
				}
			}
			throw new PasswordRequiredException();
		}
	}
	
	protected boolean isPasswordCorrect(Team team, String password) {
		if (team.hasPassword()) {
			return team.getPassword().toLowerCase().equals(password == null ? null : password.toLowerCase());
		}
		return true;
	}
	
    protected void addPasswordHashCookie(HttpServletResponse response, Team team) {
    	if (team.hasPassword()) {
        	Cookie cookie = new Cookie(PASSWORD_COOKIE_NAME, hashPassword(team, team.getPassword()));
        	cookie.setPath("/");
        	response.addCookie(cookie);
    	}
    }
	
	private String getPasswordCookieValue(HttpServletRequest request) {
		Cookie[] cookies = request.getCookies();
		if (cookies != null) {
			for(int i=0; i<cookies.length; i++) {
				Cookie cookie = cookies[i];
				if (PASSWORD_COOKIE_NAME.equals(cookie.getName())) {
						return(cookie.getValue());
				}
			}
		}
		return null;
	}
	
	protected Set<String> extractPlayerNamesFromGames(String teamId)  {
		try {
			Team team = service.getTeam(teamId);
			if (team == null) {
				return Collections.emptySet();
			} else {
				List<Game> games = service.getGames(team, false);
				Set<String> playerNames = new HashSet<String>();
				for (Game game : games) {
					extractPlayerNames(game, playerNames);
				}
				return playerNames;
			}
		} catch (Exception e) {
			logErrorAndThrow("Error on extractPlayerNames", e);
			return Collections.emptySet();
		}
	}
	
	private void extractPlayerNames(Game game, Set<String> playerNames) {
		game.extractPlayerNames(playerNames);
	}
		 
    private String convertToHex(byte[] data) { 
        StringBuffer buf = new StringBuffer();
        for (int i = 0; i < data.length; i++) { 
            int halfbyte = (data[i] >>> 4) & 0x0F;
            int two_halfs = 0;
            do { 
                if ((0 <= halfbyte) && (halfbyte <= 9)) 
                    buf.append((char) ('0' + halfbyte));
                else 
                    buf.append((char) ('a' + (halfbyte - 10)));
                halfbyte = data[i] & 0x0F;
            } while(two_halfs++ < 1);
        } 
        return buf.toString();
    } 
	 
    private String hashPassword(Team team, String password)   { 
    		String pwdToHash = password.toLowerCase();
	        MessageDigest md;
	        try {
				md = MessageDigest.getInstance("MD5");
			} catch (NoSuchAlgorithmException e) {
				throw new RuntimeException("Can't get MD5", e);
			}
	        byte[] md5hash = new byte[32];
	        md.update(team.getTeamId().getBytes(), 0, team.getTeamId().length());
	        md.update(pwdToHash.getBytes(), 0, pwdToHash.length());
	        md5hash = md.digest();
	        return convertToHex(md5hash);
	} 
    
    protected boolean isOAuth2Client(HttpServletRequest request) {
    	// subclasses can re-implement
    	return false;
    }
    
    protected boolean hasOAuth2Header(HttpServletRequest request) {
    	return request.getHeader("Authorization") != null;
    }
	
}
