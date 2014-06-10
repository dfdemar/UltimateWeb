package com.summithill.ultimate.model;

import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Key;

public class Player extends ModelObject implements Comparable<Player> {
	public static final String ENTITY_TYPE_NAME = "Player";
	public static final String NAME_PROPERTY = "name";
	public static final String FIRST_NAME_PROPERTY = "firstName";
	public static final String LAST_NAME_PROPERTY = "lastName";
	public static final String NUMBER_PROPERTY = "number";
	public static final String IS_MALE_PROPERTY = "isMale";
	public static final String POSITION_PROPERTY = "position";
	public static final String LEAGUEVINE_JSON = "leaguevinePlayer";
	
	private Player(Entity entity) {
		super();
		this.entity = entity;
	}
	
	public Player(Team team, String name) {
		this(team.asEntity().getKey(), name);
	}
	
	private Player(Key teamKey, String name) {
		this(new Entity(ENTITY_TYPE_NAME, teamKey));
		setName(name);
	}
	
	public static Player fromEntity(Entity entity) {
		return new Player(entity);
	}
	
	public String getName() {
		return (String)entity.getProperty(NAME_PROPERTY);
	}
	
	public void setName(String name) {
		entity.setProperty(NAME_PROPERTY, name);
	}
	
	public String getLastName() {
		return (String)entity.getProperty(LAST_NAME_PROPERTY);
	}
	
	public void setLastName(String name) {
		entity.setProperty(LAST_NAME_PROPERTY, name);
	}
	
	public String getFirstName() {
		return (String)entity.getProperty(FIRST_NAME_PROPERTY);
	}
	
	public void setFirstName(String name) {
		entity.setProperty(FIRST_NAME_PROPERTY, name);
	}

	public String getNumber() {
		return (String)entity.getProperty(NUMBER_PROPERTY);
	}
	
	public void setNumber(String number) {
		entity.setProperty(NUMBER_PROPERTY, number);
	}
	
	public String getPosition() {
		return (String)entity.getProperty(POSITION_PROPERTY);
	}
	
	public void setPosition(String number) {
		entity.setProperty(POSITION_PROPERTY, number);
	}
	
	public boolean isMale() {
		Boolean answer = (Boolean)entity.getProperty(IS_MALE_PROPERTY);
		return answer == null ? false : answer.booleanValue();
	}
	
	public void setIsMale(boolean isMale) {
		entity.setProperty(IS_MALE_PROPERTY, Boolean.valueOf(isMale));
	}
	
	public String getLeaguevinePlayerJson() {
		return (String)entity.getProperty(LEAGUEVINE_JSON);
	}
	
	public void setLeaguevinePlayerJson(String json) {
		entity.setProperty(LEAGUEVINE_JSON, json);
	}

	
	public Player clone(String userIdentifier, Team team) {
		Player playerClone = new Player(team, getName());
		copyProperties(entity, playerClone.entity, userIdentifier);
		return playerClone;
	}

	@Override
	public int compareTo(Player otherPlayer) {
		return this.getName().compareToIgnoreCase(otherPlayer.getName());
	}
}

;;