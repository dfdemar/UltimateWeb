package com.summithill.ultimate.model;

import com.google.appengine.api.datastore.Entity;

public class Team extends ModelObject {
	public static final String ENTITY_TYPE_NAME = "Team";
	public static final String NAME_PROPERTY = "name";
	public static final String IS_MIXED_PROPERTY = "isMixed";
	public static final String IS_DISPLAYING_NUMBER_PROPERTY = "isDispNumb";
	public static final String MOBILE_TEAMID_PROPERTY = "teamId";
	public static final String WEBSITE_PASSWORD_PROPERTY = "password";
	public static final String ARE_PLAYERS_FROM_LEAGUEVINE = "playersAreLeaguevine";
	public static final String NUMBER_OF_GAMES = "numberOfGames";
	public static final String FIRST_GAME_DATE = "firstGameDate";
	public static final String LAST_GAME_DATE = "lastGameDate";
	public static final String IS_DELETED = "isDeleted";
	
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
	
	public String getNameWithSeason() {
		String name = getName();
		if (!name.matches(".*201[0-9].*")) {
			String season = getSeason();
			if (season.length() > 0) {
				name = name + " " + season;
			}
		}
		return name;
	}
	
	public String getSeason() {
		String season = "";
		String firstDate = getFirstGameDate();
		if (firstDate != null && firstDate.length() >= 4) {
			String firstYear = firstDate.substring(0, 4);
			season = firstYear;
			String lastDate = getLastGameDate();
			if (lastDate != null && lastDate.length() >= 4 && !lastDate.startsWith(firstYear)) {
				season = season + "-" + lastDate.substring(0, 4);
			}
		}
		return season;
	}
	
	public String getMobileId() {
		return (String)entity.getProperty(MOBILE_TEAMID_PROPERTY);
	}
	
	public void setMobileId(String teamName) {
		entity.setProperty(MOBILE_TEAMID_PROPERTY, teamName);
	}
	
	public long getNumberOfGames() {
		Long answer = (Long)entity.getProperty(NUMBER_OF_GAMES);
		return answer == null ? 0 : answer.longValue();
	}
	
	public void setNumberOfGames(long num) {
		entity.setProperty(NUMBER_OF_GAMES, Long.valueOf(num));
	}
	
	public String getFirstGameDate() {
		return (String)entity.getProperty(FIRST_GAME_DATE);
	}
	
	public void setFirstGameDate(String mmmmddyy) {
		entity.setProperty(FIRST_GAME_DATE, mmmmddyy);
	}
	
	public String getLastGameDate() {
		return (String)entity.getProperty(LAST_GAME_DATE);
	}
	
	public void setLastGameDate(String mmmmddyy) {
		entity.setProperty(LAST_GAME_DATE, mmmmddyy);
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
	
	public String getPassword() {
		return (String)entity.getProperty(WEBSITE_PASSWORD_PROPERTY);
	}
	
	public void setPassword(String password) {
		entity.setProperty(WEBSITE_PASSWORD_PROPERTY, password == null ? null : password.trim());
	}
	
	public String getLeaguevineJson() {
		return (String)entity.getProperty(LEAGUEVINE_JSON_PROPERTY);
	}
	
	public void setLeaguevineJson(String json) {
		entity.setProperty(LEAGUEVINE_JSON_PROPERTY, json);
	}
	
	public boolean isDelected() {
		Boolean answer = (Boolean)entity.getProperty(IS_DELETED);
		return answer == null ? false : answer.booleanValue();
	}
	
	public void setDeleted(boolean isDeleted) {
		entity.setProperty(IS_DELETED, Boolean.valueOf(isDeleted));
	}
	
	public boolean hasPassword() {
		String pwd = this.getPassword();
		return pwd != null && !pwd.isEmpty();
	}
	
	public boolean arePlayersFromLeaguevine() {
		Boolean answer = (Boolean)entity.getProperty(ARE_PLAYERS_FROM_LEAGUEVINE);
		return answer == null ? false : answer.booleanValue();
	}

	public void setArePlayersFromLeaguevine(boolean arePlayersFromLeaguevine) {
		entity.setProperty(ARE_PLAYERS_FROM_LEAGUEVINE, Boolean.valueOf(arePlayersFromLeaguevine));
	}
	
	public Team clone(String userIdentifier) {
		Entity entityClone = new Entity(ENTITY_TYPE_NAME);
		copyProperties(entity, entityClone, userIdentifier);
		return Team.fromEntity(entityClone);
	}

}

;;