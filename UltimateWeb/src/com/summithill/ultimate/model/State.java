package com.summithill.ultimate.model;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

import com.google.appengine.api.datastore.Entity;
/*
 * A generic state object which can be used to store session state or other state data
 * The State is owned by a Team and cannot be moved to another team
 */
import com.google.appengine.api.datastore.Text;

public class State extends ModelObject implements Comparable<State> {
	public static final String ENTITY_TYPE_NAME = "State";
	public static final String TEAM_ID_PROPERTY = "teamId";
	public static final String TYPE_PROPERTY = "type";
	public static final String DATA_PROPERTY = "data";
	public static final String LAST_UPDATE_UTC_PROPERTY = "lastUpdateUtc";
	
	private State(Entity entity) {
		super();
		this.entity = entity;
	}
	
	public State(Team team, String type, String json) {
		this(new Entity(ENTITY_TYPE_NAME));
		setTeamId(team.getPersistenceId());
		setType(type);
		setJson(json);
	}
	
	public static State fromEntity(Entity entity) {
		return new State(entity);
	}

	public String getStateId() {
		return getPersistenceId();
	}
	
	public String getTeamId() {
		return (String)entity.getProperty(TEAM_ID_PROPERTY);
	}
	
	public void setTeamId(String type) {
		entity.setProperty(TEAM_ID_PROPERTY, type);
	}
	public String getJson() {
		Text text = (Text)entity.getProperty(DATA_PROPERTY);
		return text == null ? null : text.getValue();
	}
	
	public void setJson(String json) {
		Text text = json == null ? null : new Text(json);
		entity.setProperty(DATA_PROPERTY, text);
	}
	
	public String getType() {
		return (String)entity.getProperty(TYPE_PROPERTY);
	}
	
	public void setType(String type) {
		entity.setProperty(TYPE_PROPERTY, type);
	}
	
	public String getLastUpdateUtc() {
		return (String)entity.getProperty(LAST_UPDATE_UTC_PROPERTY);
	}
	
	public void setLastUpdateUtc(String timestamp) {
		entity.setProperty(LAST_UPDATE_UTC_PROPERTY, timestamp);
	}

	public void resetLastUpdateUtc() {
		TimeZone utc = TimeZone.getTimeZone("UTC");
		DateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm");
		formatter.setTimeZone(utc);
		String nowAsUtcFormattedString = formatter.format(new Date());
		setLastUpdateUtc(nowAsUtcFormattedString);
	}

	@Override
	public int compareTo(State otherState) {
		return this.getJson().compareToIgnoreCase(otherState.getJson());
	}

}
