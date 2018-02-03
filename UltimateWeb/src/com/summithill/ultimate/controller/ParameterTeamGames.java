package com.summithill.ultimate.controller;

import java.util.ArrayList;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ParameterTeamGames {
	private String teamId;
	private ArrayList<String> gameIds = new ArrayList<String>();  
	
	public ParameterTeamGames() {
		super();
	}
	
	public String getTeamId() {
		return teamId;
	}
	public void setTeamId(String teamId) {
		this.teamId = teamId;
	}
	public ArrayList<String> getGameIds() {
		return gameIds;
	}
	public void setGameIds(ArrayList<String> gameIds) {
		this.gameIds = gameIds;
	}
}
