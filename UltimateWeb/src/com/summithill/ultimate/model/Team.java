package com.summithill.ultimate.model;

import com.google.appengine.api.datastore.Entity;

public class Team extends ModelObject {
	public static final String ENTITY_TYPE_NAME = "Team";
	public static final String NAME_PROPERTY = "name";
	public static final String IS_MIXED_PROPERTY = "isMixed";
	public static final String IS_DISPLAYING_NUMBER_PROPERTY = "isDispNumb";
	public static final String MOBILE_TEAMID_PROPERTY = "teamId";
	
	public Team(String name) {
		this(new Entity(ENTITY_TYPE_NAME));
		setName(name);
	}
	
	private Team(Entity entity) {
		super();
		this.entity = entity;
	}
	
	public static Team fromEntity(Entity entity) {
		return new Team(entity);
	}
	
	public String getTeamId() {
		return getPersistenceId();
	}
	
	public String getName() {
		return (String)entity.getProperty(NAME_PROPERTY);
	}
	
	public void setName(String teamName) {
		entity.setProperty(NAME_PROPERTY, teamName);
	}
	
	public String getMobileId() {
		return (String)entity.getProperty(MOBILE_TEAMID_PROPERTY);
	}
	
	public void setMobileId(String teamName) {
		entity.setProperty(MOBILE_TEAMID_PROPERTY, teamName);
	}

	public boolean isMixed() {
		Boolean answer = (Boolean)entity.getProperty(IS_MIXED_PROPERTY);
		return answer == null ? false : answer.booleanValue();
	}
	
	public void setIsMale(boolean isMixed) {
		entity.setProperty(IS_MIXED_PROPERTY, Boolean.valueOf(isMixed));
	}
	
	public boolean isDisplayingPlayerNumber() {
		Boolean answer = (Boolean)entity.getProperty(IS_DISPLAYING_NUMBER_PROPERTY);
		return answer == null ? false : answer.booleanValue();
	}
	
	public void setIsDisplayingPlayerNumber(boolean isDisplayNumber) {
		entity.setProperty(IS_DISPLAYING_NUMBER_PROPERTY, Boolean.valueOf(isDisplayNumber));
	}
	
}

;;