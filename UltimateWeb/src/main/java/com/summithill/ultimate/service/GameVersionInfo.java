package com.summithill.ultimate.service;

import static com.summithill.ultimate.model.GameVersion.DESCRIPTION_PROPERTY;
import static com.summithill.ultimate.model.GameVersion.SCORE_OURS_PROPERTY;
import static com.summithill.ultimate.model.GameVersion.SCORE_THEIRS_PROPERTY;
import static com.summithill.ultimate.model.GameVersion.UPDATE_HASH_PROPERTY;
import static com.summithill.ultimate.model.GameVersion.UPDATE_UTC_PROPERTY;

import com.google.appengine.api.datastore.Entity;

public class GameVersionInfo {
	private long keyIdentifier;
	private String description;
	private String updateUtc;
	private String updateHash;
	private Long ourScore;
	private Long theirScore;
	
	public static GameVersionInfo fromEntity(Entity entity) {
		GameVersionInfo gameVersionInfo = new GameVersionInfo();
		gameVersionInfo.keyIdentifier = entity.getKey().getId();
		gameVersionInfo.updateUtc = (String)entity.getProperty(UPDATE_UTC_PROPERTY);
		gameVersionInfo.updateHash = (String)entity.getProperty(UPDATE_HASH_PROPERTY);
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
	public String getUpdtateUtc() {
		return updateUtc;
	}
	public String getUpdateHash() {
		return updateHash;
	}
	public Long getOurScore() {
		return ourScore;
	}
	public Long getTheirScore() {
		return theirScore;
	}

}
