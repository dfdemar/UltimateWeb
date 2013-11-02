package com.summithill.ultimate.controller;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;

@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
public class ParameterGamePlayerStats {
	private String gameId;
	private String playerStatsJson;
	
	public ParameterGamePlayerStats(String gameId, String playerStatsJson) {
		super();
		this.gameId = gameId;
		this.playerStatsJson = playerStatsJson;
	}
	public ParameterGamePlayerStats() {
		super();
	}
	
	public String getGameId() {
		return gameId;
	}
	public void setGameId(String gameId) {
		this.gameId = gameId;
	}
	public String getPlayerStatsJson() {
		return playerStatsJson;
	}
	public void setPlayerStatsJson(String playerStatsJson) {
		this.playerStatsJson = playerStatsJson;
	}
}
