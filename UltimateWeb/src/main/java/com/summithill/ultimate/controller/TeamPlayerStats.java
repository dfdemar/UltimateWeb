package com.summithill.ultimate.controller;

public class TeamPlayerStats {
	private String teamId;
	private boolean isPrivate;
	private String playerStatsJson;
	
	public TeamPlayerStats(String teamId) {
		super();
		this.teamId = teamId;
	}
	
	public String getTeamId() {
		return teamId;
	}
	public void setTeamId(String teamId) {
		this.teamId = teamId;
	}
	public boolean isPrivate() {
		return isPrivate;
	}
	public void setPrivate(boolean isPrivate) {
		this.isPrivate = isPrivate;
	}
	public String getPlayerStatsJson() {
		return playerStatsJson;
	}
	public void setPlayerStatsJson(String playerStatsJson) {
		this.playerStatsJson = playerStatsJson;
	}

}
