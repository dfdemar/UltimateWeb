package com.summithill.ultimate.model;

import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.Text;

public class GameVersion extends ModelObject {
	public static final String ENTITY_TYPE_NAME = "GameVersion";
	public static final String SCORE_OURS_PROPERTY = "scoreOurs";
	public static final String SCORE_THEIRS_PROPERTY = "scoreTheirs";
	public static final String DESCRIPTION_PROPERTY = "description";
	public static final String UPDATE_UTC_PROPERTY = "updateUtc";
	public static final String UPDATE_HASH_PROPERTY = "updateHash";
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
	
	public String getUpdateUtc() {
		return (String)entity.getProperty(UPDATE_UTC_PROPERTY);
	}
	
	public void setUpdateUtc(String timestamp) {
		entity.setProperty(UPDATE_UTC_PROPERTY, timestamp);
	}
	
	public String getUpdateHash() {
		return (String)entity.getProperty(UPDATE_HASH_PROPERTY);
	}
	
	public void setUpdateHash(String hash) {
		entity.setProperty(UPDATE_HASH_PROPERTY, hash);
	}
	
	public String getDescription() {
		return (String)entity.getProperty(DESCRIPTION_PROPERTY);
	}
	
	public void setDescription(String name) {
		entity.setProperty(DESCRIPTION_PROPERTY, name);
	}
	
	public String getExportData() {
		Text text = (Text)entity.getProperty(EXPORT_PROPERTY);
		return text == null ? null : text.getValue();
	}
	
	public void setExportData(String json) {
		Text text = json == null ? null : new Text(json);
		entity.setProperty(EXPORT_PROPERTY, text);
	}

}
