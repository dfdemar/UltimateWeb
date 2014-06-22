package com.summithill.ultimate.model;

import java.io.StringWriter;
import java.security.MessageDigest;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.Text;
import com.summithill.ultimate.controller.Wind;
import com.summithill.ultimate.model.lightweights.Point;
import com.summithill.ultimate.util.JsonUtil;

public class Game extends ModelObject {
	public static final String ENTITY_TYPE_NAME = "Game";
	public static final String TIMESTAMP_PROPERTY = "timestamp";
	public static final String SCORE_OURS_PROPERTY = "scoreOurs";
	public static final String SCORE_THEIRS_PROPERTY = "scoreTheirs";
	public static final String GAME_ID_NAME_PROPERTY = "gameId";
	public static final String OPPONENT_NAME_PROPERTY = "opponent";
	public static final String TOURNAMENT_NAME_PROPERTY = "tournament";
	public static final String GAME_POINT_PROPERTY = "gamePoint";
	public static final String IS_FIRST_POINT_OLINE_PROPERTY = "isFirstPointOline";
	public static final String POINTS_JSON_PROPERTY = "pointsJson";
	public static final String WIND_JSON_PROPERTY = "wind";
	public static final String TIMEOUT_DETAILS_JSON_PROPERTY = "timeoutDetailsJson";
	public static final String LAST_UPDATE_UTC_PROPERTY = "lastUpdateUtc";
	public static final String LAST_UPDATE_HASH_PROPERTY = "lastUpdateHash";
	public static final String IS_DELETED = "isDeleted";
	private List<Point> points; // transient
	private Wind wind; // transient
	
	private Game(Entity entity) {
		super();
		this.entity = entity;
	}
	
	public Game(Team team) {
		this(team.asEntity().getKey());
	}
	
	private Game(Key teamKey) {
		this(new Entity(ENTITY_TYPE_NAME, teamKey));
	}
	
	public static Game fromEntity(Entity entity) {
		return new Game(entity);
	}
	
	public String getTeamId() {
		return Long.toString(entity.getParent().getId());
	}
	
	public String getTeamPersistenceId() {
		return getParentPersistenceId();
	}
	
	public String getGameId() {
		return (String)entity.getProperty(GAME_ID_NAME_PROPERTY);
	}
	
	public void setGameId(String id) {
		entity.setProperty(GAME_ID_NAME_PROPERTY, id);
	}
	
	public String getOpponentName() {
		return (String)entity.getProperty(OPPONENT_NAME_PROPERTY);
	}
	
	public void setOpponentName(String name) {
		entity.setProperty(OPPONENT_NAME_PROPERTY, name);
	}
	
	public String getTournamentName() {
		return (String)entity.getProperty(TOURNAMENT_NAME_PROPERTY);
	}
	
	public void setTournamentName(String name) {
		entity.setProperty(TOURNAMENT_NAME_PROPERTY, name);
	}
	
	public String getTimestamp() {
		return (String)entity.getProperty(TIMESTAMP_PROPERTY);
	}
	
	public void setTimestamp(String name) {
		entity.setProperty(TIMESTAMP_PROPERTY, name);
	}
	
	public String getLastUpdateUtc() {
		return (String)entity.getProperty(LAST_UPDATE_UTC_PROPERTY);
	}
	
	public void setLastUpdateUtc(String timestamp) {
		entity.setProperty(LAST_UPDATE_UTC_PROPERTY, timestamp);
	}
	
	public String getLastUpdateHash() {
		return (String)entity.getProperty(LAST_UPDATE_HASH_PROPERTY);
	}
	
	private void setLastUpdateHash(String hash) {
		entity.setProperty(LAST_UPDATE_HASH_PROPERTY, hash);
	}
	
	public void resetHash() {
		try {
			MessageDigest md = MessageDigest.getInstance("MD5");
			JsonUtil.updateDigest(md, isDeleted());
			JsonUtil.updateDigest(md, getOpponentName());
			JsonUtil.updateDigest(md, getTournamentName());
			JsonUtil.updateDigest(md, isFirstPointOline());
			JsonUtil.updateDigest(md, getGamePoint());
			JsonUtil.updateDigest(md, getOurScore());
			JsonUtil.updateDigest(md, getTheirScore());
			JsonUtil.updateDigestWithJsonString(md, getWindJson());
			JsonUtil.updateDigestWithJsonString(md, getPointsJson());
			JsonUtil.updateDigestWithJsonString(md, getTimeoutDetailsJson());
			setLastUpdateHash(JsonUtil.digestAsString(md));
		} catch (Exception e) {
			// if we have an error...assume that things have changed...force a new hash value
			logError("Error attempting to reset game last upate hash...generating a unique hash value instead.  Game was vs. " + getOpponentName(), e);
			setLastUpdateHash(UUID.randomUUID().toString());
		}
	}
	
	public Long getOurScore() {
		Long score = (Long)entity.getProperty(SCORE_OURS_PROPERTY);
		if (score != null && score.longValue() > 1000) { // fix bad data
			score = new Long(0);
		}
		return score;
	}
	
	public void setOurScore(Long score) {
		entity.setProperty(SCORE_OURS_PROPERTY, score);
	}
	
	public Long getTheirScore() {
		Long score = (Long)entity.getProperty(SCORE_THEIRS_PROPERTY);
		if (score != null && score.longValue() > 1000) { // fix bad data
			score = new Long(0);
		}
		return score;
	}
	
	public void setTheirScore(Long score) {
		entity.setProperty(SCORE_THEIRS_PROPERTY, score);
	}

	public String getPointsJson() {
		Text text = (Text)entity.getProperty(POINTS_JSON_PROPERTY);
		return text == null ? null : text.getValue();
	}
	
	public void setPointsJson(String json) {
		Text text = json == null ? null : new Text(json);
		entity.setProperty(POINTS_JSON_PROPERTY, text);
	}
	
	public String getLeaguevineJson() {
		return (String)entity.getProperty(LEAGUEVINE_JSON_PROPERTY);
	}
	
	public void setLeaguevineJson(String json) {
		entity.setProperty(LEAGUEVINE_JSON_PROPERTY, json);
	}
	
	public boolean isDeleted() {
		Boolean answer = (Boolean)entity.getProperty(IS_DELETED);
		return answer == null ? false : answer.booleanValue();
	}
	
	public void setDeleted(boolean isDeleted) {
		entity.setProperty(IS_DELETED, Boolean.valueOf(isDeleted));
	}
	
	@SuppressWarnings("unchecked")
	public List<Point> getPoints() {
		if (points == null) {
			String json = this.getPointsJson();
			try {
				points = (List<Point>) (json == null ? Collections.EMPTY_LIST : new ObjectMapper().readValue(json, new TypeReference<List<Point>>() {} ));
			} catch (Exception e) {
				throw new RuntimeException("Unable to parse points json",e);
			} 
		}
		return points;
	}
	
	public void setPoints(List<Point> points) {
		try {
			StringWriter writer = new StringWriter();
			new ObjectMapper().writeValue(writer, points);
			String json = writer.toString();
			setPointsJson(json);
		} catch (Exception e) {
			throw new RuntimeException("Unable to convert points to json",e);
		} 
	}
	
	public int getGamePoint() {
		Long gamePoint = (Long)entity.getProperty(GAME_POINT_PROPERTY);
		return gamePoint == null ? 0 : gamePoint.intValue();
	}
	
	public void setGamePoint(long gamePoint) {
		entity.setProperty(GAME_POINT_PROPERTY, Long.valueOf(gamePoint));
	}

	public boolean isFirstPointOline() {
		Boolean gamePoint = (Boolean)entity.getProperty(IS_FIRST_POINT_OLINE_PROPERTY);
		return gamePoint == null ? false : gamePoint.booleanValue();
	}

	public void setFirstPointOline(boolean isFirstPointOline) {
		entity.setProperty(IS_FIRST_POINT_OLINE_PROPERTY, Boolean.valueOf(isFirstPointOline));
	}

	public Wind getWind() {
		if (wind == null) {
			String json = this.getWindJson();
			try {
				wind = (Wind) (json == null ? null : new ObjectMapper().readValue(json, new TypeReference<Wind>() {} ));
			} catch (Exception e) {
				throw new RuntimeException("Unable to parse points json",e);
			}
		}
		return wind;
	}
	
	public void setWind(Wind wind) {
		this.wind = wind;
		try {
			entity.setProperty(WIND_JSON_PROPERTY, wind == null ? null : new ObjectMapper().writeValueAsString(wind));
		} catch (Exception e) {
			throw new RuntimeException("Unable to convert Wind to json",e);
		}
	}
	
	public String getWindJson() {
		return (String)entity.getProperty(WIND_JSON_PROPERTY);
	}
	
	public String getTimeoutDetailsJson() {
		Text text = (Text)entity.getProperty(TIMEOUT_DETAILS_JSON_PROPERTY);
		return text == null ? null : text.getValue();
	}
	
	public void setTimeoutDetailsJson(String json) {
		Text text = json == null ? null : new Text(json);
		entity.setProperty(TIMEOUT_DETAILS_JSON_PROPERTY, text);
	}
	
	public int halftimeHighestScore() {
		return (int) Math.ceil(this.getGamePoint() / 2);
	}
	
	public Game clone(String userIdentifier, Team team) {
		Game gameClone = new Game(team);
		copyProperties(entity, gameClone.entity, userIdentifier);
		return gameClone;
	}
	
	public void extractPlayerNames(Set<String> playerNames) {
		List<Point> points = getPoints();
		for (Point point : points) {
			point.extractPlayerNames(playerNames);
		}
		setPoints(points);
	}
	
	public void renamePlayer(String oldPlayerName, String newPlayerName) {
		List<Point> points = getPoints();
		for (Point point : points) {
			point.renamePlayer(oldPlayerName, newPlayerName);
		}
		setPoints(points);
	}
	
	public boolean hasSameHash(String otherHash) {
		if (getLastUpdateHash() == null || otherHash == null) {
			return false;
		} else {
			return getLastUpdateHash().equals(otherHash);
		}
	}
	
	@Override
	public String toString() {
		return "Game v. " + getOpponentName();
	}
	
}
