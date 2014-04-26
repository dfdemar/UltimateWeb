package com.summithill.ultimate.model;

import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Key;

public class ModelObject {
	public static final String USER_ID_PROPERTY = "user";
	
	public static final String LEAGUEVINE_JSON_PROPERTY = "leaguevineJson";
	
	protected Entity entity;
	
	public String getUserIdentifier() {
		return entity == null || entity.getKey() == null ? null : (String)entity.getProperty(USER_ID_PROPERTY);
	}
	
	public Entity asEntity() {
		return this.entity;
	}
	
	public String getPersistenceId() {
		return entity == null || entity.getKey() == null ? null : Long.toString(entity.getKey().getId());
	}
	
	
	public String getParentPersistenceId() {
		if (entity != null) {
			Key parentKey = entity.getParent();
			return parentKey == null ? null : Long.toString(parentKey.getId());
		}
		return null;
	}
	
	public Key getParentPersistenceKey() {
		if (entity != null) {
			Key parentKey = entity.getParent();
			return parentKey;
		}
		return null;
	}
	
	protected void copyProperties(Entity fromEntity, Entity toEntity, String userIdentifier) {
		toEntity.setPropertiesFrom(fromEntity);
		toEntity.setProperty(USER_ID_PROPERTY, userIdentifier);
	}
}
