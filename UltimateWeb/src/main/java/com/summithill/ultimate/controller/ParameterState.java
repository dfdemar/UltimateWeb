package com.summithill.ultimate.controller;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.summithill.ultimate.model.State;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ParameterState {
	private String stateId;
	private String type;
	private String json;
	private String teamNameWithSeason;
	private boolean isTeamPrivate;
	
	public static ParameterState fromState(State state) {
		ParameterState pState = new ParameterState();
		pState.setStateId(state.getStateId());
		pState.setJson(state.getJson());
		pState.setType(state.getType());
		return pState;
	}

	public String getStateId() {
		return stateId;
	}

	public void setStateId(String stateId) {
		this.stateId = stateId;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getJson() {
		return json;
	}

	public void setJson(String json) {
		this.json = json;
	}

	public String getTeamNameWithSeason() {
		return teamNameWithSeason;
	}

	public void setTeamNameWithSeason(String teamNameWithSeason) {
		this.teamNameWithSeason = teamNameWithSeason;
	}

	public boolean isTeamPrivate() {
		return isTeamPrivate;
	}

	public void setTeamPrivate(boolean isTeamPrivate) {
		this.isTeamPrivate = isTeamPrivate;
	}

}
