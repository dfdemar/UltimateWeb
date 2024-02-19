package com.summithill.ultimate.statistics;

import java.util.Collection;

public class AllStats {
	private TeamStats teamStats;
	private Collection<PlayerStats> playerStats;
	public TeamStats getTeamStats() {
		return teamStats;
	}
	public void setTeamStats(TeamStats teamStats) {
		this.teamStats = teamStats;
	}
	public Collection<PlayerStats> getPlayerStats() {
		return playerStats;
	}
	public void setPlayerStats(Collection<PlayerStats> playerStats) {
		this.playerStats = playerStats;
	}

}
