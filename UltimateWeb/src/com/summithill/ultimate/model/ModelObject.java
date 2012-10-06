package com.summithill.ultimate.model;

import com.google.appengine.api.datastore.Entity;

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
}
