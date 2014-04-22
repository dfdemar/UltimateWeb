package com.summithill.ultimate.controller;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.summithill.ultimate.model.Team;

@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
public class ParameterTeamInfo {
	private String cloudId;
	private String name;
	private String nameWithSeason;
	private boolean isMixed;
	private boolean isPasswordProtected;
	private int numberOfGames;
	private String firstGameDate;
	private String lastGameDate;
	
	public static ParameterTeamInfo fromTeam(Team team) {
		ParameterTeamInfo pTeam = new ParameterTeamInfo();
		pTeam.setCloudId(team.getPersistenceId());
		pTeam.setName(team.getName());
		pTeam.setNameWithSeason(team.getNameWithSeason());
		pTeam.setMixed(team.isMixed());
		pTeam.setPasswordProtected(team.hasPassword());
		pTeam.setNumberOfGames((int)team.getNumberOfGames());
		pTeam.setFirstGameDate(team.getFirstGameDate());
		pTeam.setLastGameDate(team.getLastGameDate());
		return pTeam;
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

	public String getCloudId() {
		return cloudId;
	}

	public void setCloudId(String cloudId) {
		this.cloudId = cloudId;
	}

	public boolean isPasswordProtected() {
		return isPasswordProtected;
	}

	public void setPasswordProtected(boolean isPasswordProtected) {
		this.isPasswordProtected = isPasswordProtected;
	}

	public int getNumberOfGames() {
		return numberOfGames;
	}

	public void setNumberOfGames(int numberOfGames) {
		this.numberOfGames = numberOfGames;
	}

	public String getFirstGameDate() {
		return firstGameDate;
	}

	public void setFirstGameDate(String firstGameDate) {
		this.firstGameDate = firstGameDate;
	}

	public String getLastGameDate() {
		return lastGameDate;
	}

	public void setLastGameDate(String lastGameDate) {
		this.lastGameDate = lastGameDate;
	}

	public String getNameWithSeason() {
		return nameWithSeason;
	}

	public void setNameWithSeason(String nameWithSeason) {
		this.nameWithSeason = nameWithSeason;
	}

}
