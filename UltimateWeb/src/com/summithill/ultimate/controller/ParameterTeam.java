package com.summithill.ultimate.controller;

import java.util.List;

import org.codehaus.jackson.map.annotate.JsonSerialize;

import com.summithill.ultimate.model.Team;

@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
public class ParameterTeam {
	private String cloudId;
	private String teamId;  // mobile id
	private String name;
	private boolean isMixed;
	private boolean isDisplayPlayerNumber;
	private List<ParameterPlayer> players;
	private String password;
	private String leaguevineJson;
	
	public static ParameterTeam fromTeam(Team team) {
		ParameterTeam pTeam = new ParameterTeam();
		pTeam.setCloudId(team.getPersistenceId());
		pTeam.setTeamId(team.getMobileId());
		pTeam.setName(team.getName());
		pTeam.setMixed(team.isMixed());
		pTeam.setDisplayPlayerNumber(team.isDisplayingPlayerNumber());
		pTeam.setLeaguevineJson(team.getLeaguevineJson());
		return pTeam;
	}
	
	public void copyToTeam(Team team) {
		team.setMobileId(teamId);
		team.setName(name);
		team.setIsMale(isMixed);
		team.setIsDisplayingPlayerNumber(isDisplayPlayerNumber);
		team.setLeaguevineJson(leaguevineJson);
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

	public boolean isDisplayPlayerNumber() {
		return isDisplayPlayerNumber;
	}

	public void setDisplayPlayerNumber(boolean isDisplayPlayerNumber) {
		this.isDisplayPlayerNumber = isDisplayPlayerNumber;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getLeaguevineJson() {
		return leaguevineJson;
	}

	public void setLeaguevineJson(String leaguevineJson) {
		this.leaguevineJson = leaguevineJson;
	}
}
