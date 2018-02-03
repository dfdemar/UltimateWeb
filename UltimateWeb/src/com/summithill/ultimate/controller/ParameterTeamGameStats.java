package com.summithill.ultimate.controller;

import java.util.ArrayList;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ParameterTeamGameStats {
	private String teamId;
	private ArrayList<ParameterGamePlayerStatistics> statsForGames = new ArrayList<ParameterGamePlayerStatistics>();  
	
	public ParameterTeamGameStats() {
		super();
	}
	
	public String getTeamId() {
		return teamId;
	}
	public void setTeamId(String teamId) {
		this.teamId = teamId;
	}

	public ArrayList<ParameterGamePlayerStatistics> getStatsForGames() {
		return statsForGames;
	}

	public void setStatsForGames(ArrayList<ParameterGamePlayerStatistics> statsForGames) {
		this.statsForGames = statsForGames;
	}

}
