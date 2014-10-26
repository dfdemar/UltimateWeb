package com.summithill.ultimate.model;

import com.google.appengine.api.datastore.Entity;

public class GameUpdateEvent extends ModelObject {
	public static final String ENTITY_TYPE_NAME = "GameUpdate";
	public static final String GAME_ID_NAME_PROPERTY = "gameId";
	public static final String TEAM_ID_PROPERTY = "teamId";
	public static final String LAST_UPDATE_UTC_PROPERTY = "lastUpdateUtc";
	public static final String NOTIFY_URL_PROPERTY = "notifyUrl";
	
	public GameUpdateEvent(String teamId, String gameId) {
		this(new Entity(ENTITY_TYPE_NAME));
		setTeamId(teamId);
		setGameId(gameId);
	}
	
	private GameUpdateEvent(Entity entity) {
		super();
		this.entity = entity;
	}
	
	public static GameUpdateEvent fromEntity(Entity entity) {
		return new GameUpdateEvent(entity);
	}
	
	public String getTeamId() {
		return (String)entity.getProperty(TEAM_ID_PROPERTY);
	}
	
	public void setTeamId(String gameId) {
		entity.setProperty(TEAM_ID_PROPERTY, gameId);
	}

	public String getGameId() {
		return (String)entity.getProperty(GAME_ID_NAME_PROPERTY);
	}
	
	public void setGameId(String gameId) {
		entity.setProperty(GAME_ID_NAME_PROPERTY, gameId);
	}
	
	public String getLastUpdateUtc() {
		return (String)entity.getProperty(LAST_UPDATE_UTC_PROPERTY);
	}
	
	public void setLastUpdateUtc(String timestamp) {
		entity.setProperty(LAST_UPDATE_UTC_PROPERTY, timestamp);
	}
	
	public String getNotifyUrl() {
		return (String)entity.getProperty(NOTIFY_URL_PROPERTY);
	}
	
	public void setNotifyUrl(String url) {
		entity.setProperty(NOTIFY_URL_PROPERTY, url);
	}
	
	public String getNotifyUrlWithTeamAndGameParameters() {
		String additionalQueryString = (getNotifyUrl().contains("?") ? "&" : "?") + "team=" + getTeamId() + "&game=" + getGameId();
		return getNotifyUrl() + additionalQueryString;
	}
	

}
