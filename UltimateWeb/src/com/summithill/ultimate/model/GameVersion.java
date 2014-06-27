package com.summithill.ultimate.model;

import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Key;

public class GameVersion extends ModelObject {
	public static final String ENTITY_TYPE_NAME = "GameVersion";
	public static final String SCORE_OURS_PROPERTY = "scoreOurs";
	public static final String SCORE_THEIRS_PROPERTY = "scoreTheirs";
	public static final String DESCRIPTION_PROPERTY = "description";
	public static final String LAST_UPDATE_UTC_PROPERTY = "lastUpdateUtc";
	public static final String EXPORT_PROPERTY = "exportData";
	
	private GameVersion(Entity entity) {
		super();
		this.entity = entity;
	}
	
	public GameVersion(Game game) {
		this(game.asEntity().getKey());
	}
	
	private GameVersion(Key gameKey) {
		this(new Entity(ENTITY_TYPE_NAME, gameKey));
	}
	
	public static GameVersion fromEntity(Entity entity) {
		return new GameVersion(entity);
	}
	
	public String getGamePersistenceId() {
		return getParentPersistenceId();
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
	
	public String getLastUpdateUtc() {
		return (String)entity.getProperty(LAST_UPDATE_UTC_PROPERTY);
	}
	
	public void setLastUpdateUtc(String timestamp) {
		entity.setProperty(LAST_UPDATE_UTC_PROPERTY, timestamp);
	}
	
	public String getDescription() {
		return (String)entity.getProperty(DESCRIPTION_PROPERTY);
	}
	
	public void setDescription(String name) {
		entity.setProperty(DESCRIPTION_PROPERTY, name);
	}
	
	public String getExportData() {
		return (String)entity.getProperty(EXPORT_PROPERTY);
	}
	
	public void setExportData(String name) {
		entity.setProperty(DESCRIPTION_PROPERTY, name);
	}
}
