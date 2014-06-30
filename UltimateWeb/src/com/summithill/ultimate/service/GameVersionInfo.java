package com.summithill.ultimate.service;

import static com.summithill.ultimate.model.GameVersion.*;

import com.google.appengine.api.datastore.Entity;

public class GameVersionInfo {
	private long keyIdentifier;
	private String description;
	private String lastUpdtateUtc;
	private Long ourScore;
	private Long theirScore;
	
	public static GameVersionInfo fromEntity(Entity entity) {
		GameVersionInfo gameVersionInfo = new GameVersionInfo();
		gameVersionInfo.keyIdentifier = entity.getKey().getId();
		gameVersionInfo.lastUpdtateUtc = (String)entity.getProperty(LAST_UPDATE_UTC_PROPERTY);
		gameVersionInfo.description = (String)entity.getProperty(DESCRIPTION_PROPERTY);
		gameVersionInfo.ourScore = (Long)entity.getProperty(SCORE_OURS_PROPERTY);
		gameVersionInfo.theirScore = (Long)entity.getProperty(SCORE_THEIRS_PROPERTY);
		return gameVersionInfo;
	}
	
	public long getKeyIdentifier() {
		return keyIdentifier;
	}
	public String getDescription() {
		return description;
	}
	public String getLastUpdtateUtc() {
		return lastUpdtateUtc;
	}
	public Long getOurScore() {
		return ourScore;
	}
	public Long getTheirScore() {
		return theirScore;
	}

}
