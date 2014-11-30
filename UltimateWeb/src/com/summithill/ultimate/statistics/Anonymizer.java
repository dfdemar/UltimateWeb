package com.summithill.ultimate.statistics;

import static java.util.logging.Level.WARNING;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang.time.DateUtils;

import com.summithill.ultimate.model.Game;

/*
 * 
 * This object is NOT thread-safe
 * 
 */

public class Anonymizer {
	private Logger log = Logger.getLogger(Anonymizer.class.getName());
	private int playerCharRepeat = 1;
	private char playerChar = 'a' - 1;
	private Map<String, String> nicknames;
	private Map<String, String> opponentNames;
	private Map<String, String> teamNames;
	private Map<String, String> tournamentNames;
	private Map<String, String> gameDates;

	public Anonymizer() {
		super();
		reset();
	}
	
	public void reset() { 
		nicknames = new HashMap<String, String>();
		opponentNames = new HashMap<String, String>();
		teamNames = new HashMap<String, String>();
		tournamentNames = new HashMap<String, String>();
		gameDates = new HashMap<String, String>();
	}
	
	public String anonymizeNickname(String originalName) {
		if (originalName == null) {
			return null;
		}
		String anon = nicknames.get(originalName);
		if (anon == null) {
			playerChar++;
			if (playerChar > 'z') {
				playerChar = 'a';
				playerCharRepeat++;
			}
			anon = "Player-";
			for (int i = 0; i < playerCharRepeat; i++) {
				anon = anon + playerChar;
			}
			nicknames.put(originalName, anon);
		}
		return anon;
	}
	
	public String anonymizeOpponentName(String originalName) {
		if (originalName == null) {
			return null;
		}
		String anon = opponentNames.get(originalName);
		if (anon == null) {
			anon = createHash(originalName);
			anon = "Opponent-" + anon;
			opponentNames.put(originalName, anon);
		}
		return anon;
	}
	
	public String anonymizeTeamName(String teamId) {
		if (teamId == null) {
			return null;
		}
		String anon = teamNames.get(teamId);
		if (anon == null) {
			anon = createHash(teamId);
			anon = "Team-" + anon;
			teamNames.put(teamId, anon);
		}
		return anon;
	}
	
	public String anonymizeTournamentName(String teamId, String originalTournamentName) {
		if (teamId == null || originalTournamentName == null)  {
			return null;
		}
		String key = teamId + "-" + originalTournamentName;
		String anon = tournamentNames.get(key);
		if (anon == null) {
			anon = createHash(teamId, originalTournamentName);
			anon = "Tournament-" + anon;
			tournamentNames.put(key, anon);
		}
		return anon;
	}
	
	public String anonymizeTimestamp(String originalTimestamp) {
		String anonTimestamp = gameDates.get(originalTimestamp);
		if (anonTimestamp == null) {
			log.log(WARNING, "Warning: no timestamp on game");
		}
		return anonTimestamp;
	}
	
	public void generateAnonymizedGameDates(List<Game> games) {
		this.gameDates = new HashMap<String, String>();
		Collections.sort(games, new Game.GameTimestampComparator());
		/*
			Given a list of game dates for a team, generate anon dates.
			
			Start with 1/1/2000
			If date changes, increment by 1
			For a given date, start each game on a 2 hour boundary
			
			If there are more than 11 games on a single day then games 12..n will have the same date/time
			
			Example:
			Input:
				2/3/2013 9:30
				2/3/2013 11:05
				3/4/2013 8:00
			Anon Dates:
				1/1/2010 2:00
				1/1/2010 4:00
				1/2/2010 2:00
		 */
		DateFormat timestampFormatter = Game.getTimestampDateFormatter();
		if (games.size() > 0) {
			Date firstDate = null;
			try {
				firstDate = new SimpleDateFormat("MM-dd-yyyy").parse("1-1-2000");
			} catch (ParseException e) {
				e.printStackTrace();
			}
			Date newAnonDate = firstDate;
			Date firstGameDate = games.get(0).getTimestampAsDate();
			if (firstGameDate == null) {
				firstGameDate = firstDate;
			}
			Date lastOrigDateAtMidnight = DateUtils.truncate(firstGameDate, Calendar.DAY_OF_MONTH);
			int hours = 0;
			int days = 0;
			for (Game game : games) {
				if (hours < 22) {
					hours += 2;
				}
				Date date = game.getTimestampAsDate();
				if (date == null) {
					date = lastOrigDateAtMidnight;
				}
				Date origDateAtMidnight = DateUtils.truncate(date, Calendar.DAY_OF_MONTH);  // truncate to date only
				// if date has changed...move to a new anon date
				if (!lastOrigDateAtMidnight.equals(origDateAtMidnight)) {
					days++;
					hours = 2;
				} 
				newAnonDate = DateUtils.addDays(firstDate, days);
				newAnonDate = DateUtils.addHours(newAnonDate, hours);
				this.gameDates.put(game.getTimestamp(), timestampFormatter.format(newAnonDate));
				lastOrigDateAtMidnight = origDateAtMidnight;
			}
		}
	}
	
	private String createHash(String value) {
		return createHash(value, null);
	}
	
	// value 2 is optional
	private String createHash(String value1, String value2) {
		try {
			MessageDigest md = MessageDigest.getInstance("MD5");
			md.update(value1.getBytes());
			if (value2 != null) {
				md.update(value2.getBytes());
			}
			return Base64.encodeBase64URLSafeString(md.digest());
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
			return value1;
		}
	}

}
