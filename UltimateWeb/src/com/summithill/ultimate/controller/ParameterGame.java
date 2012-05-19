package com.summithill.ultimate.controller;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import com.summithill.ultimate.model.Game;

@JsonIgnoreProperties(ignoreUnknown=true)
@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
public class ParameterGame {
	private String teamId;
	private String gameId;
	private String opponentName;
	private String tournamentName;
	private long gamePoint;
	private boolean isFirstPointOline;
	private String pointsJson;
	private String timestamp;
	private String date;
	private String time;
	private long msSinceEpoch;
	private long ours;
	private long theirs;
	
	public String getGameId() {
		return gameId;
	}
	
	public static ParameterGame fromGame(Game game) {
		ParameterGame pGame = new ParameterGame();
		pGame.setTeamId(game.getTeamId());
		pGame.setGameId(game.getGameId());
		pGame.setOpponentName(game.getOpponentName());
		pGame.setTournamentName(game.getTournamentName());
		if (game.getTimestamp() != null) {
			pGame.setTimestamp(game.getTimestamp());
			DateFormat parser = new SimpleDateFormat("yyyy-MM-dd HH:mm");
			DateFormat dateFormatter = new SimpleDateFormat("EEE, M/dd");
			DateFormat timeFormatter = new SimpleDateFormat("h:mm");
			try {
				Date date = parser.parse(game.getTimestamp());
				pGame.setDate(dateFormatter.format(date));
				pGame.setTime(timeFormatter.format(date));
				pGame.setMsSinceEpoch(date.getTime());
			} catch (Exception e) {
				throw new RuntimeException("Cannot parse/format date: " + game.getTimestamp(), e);
			}
		}
		pGame.setOurs(game.getOurScore());
		pGame.setTheirs(game.getTheirScore());
		pGame.setPointsJson(game.getPointsJson());
		pGame.setFirstPointOline(game.isFirstPointOline());
		pGame.setGamePoint(game.getGamePoint());
		return pGame;
	}

	public void copyToGame(Game game) {
		game.setGameId(gameId);
		game.setOpponentName(opponentName);
		game.setTournamentName(tournamentName);
		game.setPointsJson(pointsJson);
		game.setTimestamp(timestamp);
		game.setOurScore(ours);
		game.setTheirScore(theirs);
		game.setFirstPointOline(isFirstPointOline);
		game.setGamePoint(gamePoint);
	}
		
	public void setGameId(String gameId) {
		this.gameId = gameId;
	}
	public String getOpponentName() {
		return opponentName;
	}
	public void setOpponentName(String opponentName) {
		this.opponentName = opponentName;
	}
	public String getTournamentName() {
		return tournamentName;
	}
	public void setTournamentName(String tournamentName) {
		this.tournamentName = tournamentName;
	}
	public String getPointsJson() {
		return pointsJson;
	}
	public void setPointsJson(String pointsJson) {
		this.pointsJson = pointsJson;
	}

	public String getTeamId() {
		return teamId;
	}

	public void setTeamId(String teamId) {
		this.teamId = teamId;
	}

	public String getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(String timestamp) {
		this.timestamp = timestamp;
	}

	public long getOurs() {
		return ours;
	}

	public void setOurs(long ours) {
		this.ours = ours;
	}

	public long getTheirs() {
		return theirs;
	}

	public void setTheirs(long theirs) {
		this.theirs = theirs;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
	}

	public long getMsSinceEpoch() {
		return msSinceEpoch;
	}

	public void setMsSinceEpoch(long msSinceEpoch) {
		this.msSinceEpoch = msSinceEpoch;
	}

	public long getGamePoint() {
		return gamePoint;
	}

	public void setGamePoint(long gamePoint) {
		this.gamePoint = gamePoint;
	}

	public boolean isFirstPointOline() {
		return isFirstPointOline;
	}

	public void setFirstPointOline(boolean isFirstPointOline) {
		this.isFirstPointOline = isFirstPointOline;
	}


}
