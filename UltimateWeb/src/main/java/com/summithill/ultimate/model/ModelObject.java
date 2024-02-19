package com.summithill.ultimate.model;

import java.util.logging.Level;
import java.util.logging.Logger;

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
	
	public boolean hasBeenSaved() {
		if (entity == null || (entity.getKey() == null)) {
			return false;
		}
		return entity.getKey().getId() != 0; 
	}
	
	public Key getPersistenceKey() {
		if (entity != null) {
			return entity.getKey();
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
	
	protected void logError(String message, Exception e) {
		Logger.getLogger(this.getClass().getName()).log(Level.SEVERE, message, e);
	}
}
