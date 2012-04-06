package com.summithill.ultimate.controller;

import java.util.List;

import com.summithill.ultimate.model.Team;

public class ParameterTeam {
	private String cloudId;
	private String teamId;  // mobile id
	private String name;
	private boolean isMixed;
	private List<ParameterPlayer> players;
	
	public static ParameterTeam fromTeam(Team team) {
		ParameterTeam pTeam = new ParameterTeam();
		pTeam.setCloudId(team.getPersistenceId());
		pTeam.setTeamId(team.getMobileId());
		pTeam.setName(team.getName());
		pTeam.setMixed(team.isMixed());
		return pTeam;
	}
	
	public void copyToTeam(Team team) {
		team.setMobileId(teamId);
		team.setName(name);
		team.setIsMale(isMixed);
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public boolean isMixed() {
		return isMixed;
	}

	public void setMixed(boolean isMixed) {
		this.isMixed = isMixed;
	}

	public List<ParameterPlayer> getPlayers() {
		return players;
	}

	public void setPlayers(List<ParameterPlayer> players) {
		this.players = players;
	}

	public String getCloudId() {
		return cloudId;
	}

	public void setCloudId(String cloudId) {
		this.cloudId = cloudId;
	}

	public String getTeamId() {
		return teamId;
	}

	public void setTeamId(String teamId) {
		this.teamId = teamId;
	}
}
