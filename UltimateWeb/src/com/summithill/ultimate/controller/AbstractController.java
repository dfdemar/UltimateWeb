package com.summithill.ultimate.controller;

import static java.util.logging.Level.SEVERE;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import javax.servlet.http.Cookie;
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
	private final static String PASSWORD_COOKIE_NAME = "iultimate";
	private final static String PASSWORD_COOKIE_HASH_SEED = "foobar";
	
	@Autowired
	protected TeamService service;
    
	protected ParameterTeam getParameterTeam(@PathVariable String id, HttpServletRequest request) {
		return this.getParameterTeam(id, request, false, false);
	}
	
	protected ParameterTeam getParameterTeam(@PathVariable String id, HttpServletRequest request, boolean includePassword) {
		return this.getParameterTeam(id, request, includePassword, false);
	}
	
	protected ParameterTeam getParameterTeamAfterVerifyingWebsiteAccess(@PathVariable String id, HttpServletRequest request) {
		return this.getParameterTeam(id, request, false, true);
	}

	protected ParameterTeam getParameterTeam(@PathVariable String id, HttpServletRequest request, boolean includePassword, boolean verifyWebsitePassword) {
		try {
			Team team = service.getTeam(id);
			if (team == null) {
				return null;
			} else {
				if (verifyWebsitePassword) {
					this.verifyAccess(team, request);
				}
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
				pTeam.setPassword(team.getPassword());
				teamsResponseList.add(pTeam);
			}
			return teamsResponseList;
		} catch (Exception e) {
			logErrorAndThrow("Error on getTeams", e);
			return null;
		}
	}
	
	protected List<ParameterGame> getParameterGames(String teamId, HttpServletRequest request) {
		return getParameterGames(teamId, request, false);
	}
	
	protected List<ParameterGame> getParameterGames(String teamId, HttpServletRequest request,boolean verifyWebsitePassword) {
		try {
			Team team = service.getTeam(teamId);
			if (team == null) {
				return null;
			} else {
				if (verifyWebsitePassword) {
					this.verifyAccess(team, request);
				}
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
	
	protected ParameterGame getParameterGame(String teamId, String gameId, HttpServletRequest request, boolean verifyWebsiteAccess) {
		try {
			Team team = service.getTeam(teamId);
			if (team == null) {
				return null;
			} else {
				if (verifyWebsiteAccess) {
					verifyAccess(team, request);
				}
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
		if (t instanceof UnauthorizedException) {
			throw (UnauthorizedException)t;
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
				String correctPasswordHash = this.hashPassword(team.getPassword());
				if (correctPasswordHash.equals(userEnterdPasswordHash)) {
					return;
				}
			}
			throw new UnauthorizedException();
		}
	}
	
	protected boolean isPasswordCorrect(Team team, String password) {
		if (team.hasPassword()) {
			return team.getPassword().equals(password);
		}
		return true;
	}
	
    protected void addPasswordHashCookie(HttpServletResponse response, Team team) {
    	if (team.hasPassword()) {
        	Cookie cookie = new Cookie(PASSWORD_COOKIE_NAME, hashPassword(team.getPassword()));
        	cookie.setPath("/");
        	response.addCookie(cookie);
    	}
    }
	
	private String getPasswordCookieValue(HttpServletRequest request) {
		Cookie[] cookies = request.getCookies();
		for(int i=0; i<cookies.length; i++) {
			Cookie cookie = cookies[i];
			if (PASSWORD_COOKIE_NAME.equals(cookie.getName())) {
					return(cookie.getValue());
			}
		}
		return null;
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
	 
    private String hashPassword(String password)   { 
    		String pwdToHash = password.toLowerCase();
	        MessageDigest md;
	        try {
				md = MessageDigest.getInstance("MD5");
			} catch (NoSuchAlgorithmException e) {
				throw new RuntimeException("Can't get MD5", e);
			}
	        byte[] md5hash = new byte[32];
	        md.update(PASSWORD_COOKIE_HASH_SEED.getBytes(), 0, PASSWORD_COOKIE_HASH_SEED.length());
	        md.update(pwdToHash.getBytes(), 0, pwdToHash.length());
	        md5hash = md.digest();
	        return convertToHex(md5hash);
	} 

	
}
