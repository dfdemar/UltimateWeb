package com.summithill.ultimate.controller;

import java.util.Collection;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.summithill.ultimate.statistics.PlayerStats;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ParameterGamePlayerStatistics {
	private String gameId;
	private Collection<PlayerStats> playerStats;
		
	public ParameterGamePlayerStatistics(String gameId, Collection<PlayerStats> playerStats) {
		super();
		this.gameId = gameId;
		this.playerStats = playerStats;
	}
	
	public ParameterGamePlayerStatistics() {
		super();
	}
	
	public String getGameId() {
		return gameId;
	}
	public void setGameId(String gameId) {
		this.gameId = gameId;
	}

	public Collection<PlayerStats> getPlayerStats() {
		return playerStats;
	}

	public void setPlayerStats(Collection<PlayerStats> playerStats) {
		this.playerStats = playerStats;
	}

}
