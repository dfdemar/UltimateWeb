package com.summithill.ultimate.controller;

import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.summithill.ultimate.model.Team;

@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
public class ParameterTeam {
	private String cloudId;
	private String teamId;  // mobile id
	private String name;
	private String season;
	private String nameWithSeason;
	private boolean isMixed;
	private boolean isDisplayPlayerNumber;
	private List<ParameterPlayer> players;
	private String password;
	private String leaguevineJson;
	private boolean isPlayersAreLeaguevine;
	private int numberOfGames;
	private String firstGameDate;
	private String lastGameDate;
	private boolean isPrivate;
	private boolean isDeleted;
	
	
	public static ParameterTeam fromTeam(Team team) {
		ParameterTeam pTeam = new ParameterTeam();
		pTeam.setCloudId(team.getPersistenceId());
		pTeam.setTeamId(team.getMobileId());
		pTeam.setName(team.getName());
		pTeam.setSeason(team.getSeason());
		pTeam.setNameWithSeason(team.getNameWithSeason());
		pTeam.setMixed(team.isMixed());
		pTeam.setDisplayPlayerNumber(team.isDisplayingPlayerNumber());
		pTeam.setLeaguevineJson(team.getLeaguevineJson());
		pTeam.setPlayersAreLeaguevine(team.arePlayersFromLeaguevine());
		pTeam.setNumberOfGames((int)team.getNumberOfGames());
		pTeam.setFirstGameDate(team.getFirstGameDate());
		pTeam.setLastGameDate(team.getLastGameDate());
		pTeam.setPrivate(team.hasPassword());
		pTeam.setDeleted(team.isDelected());
		return pTeam;
	}
	
	public void copyToTeam(Team team) {
		team.setMobileId(teamId);
		team.setName(name);
		team.setIsMale(isMixed);
		team.setIsDisplayingPlayerNumber(isDisplayPlayerNumber);
		team.setLeaguevineJson(leaguevineJson);
		team.setArePlayersFromLeaguevine(isPlayersAreLeaguevine);
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

	public boolean isPlayersAreLeaguevine() {
		return isPlayersAreLeaguevine;
	}

	public void setPlayersAreLeaguevine(boolean isPlayersAreLeaguevine) {
		this.isPlayersAreLeaguevine = isPlayersAreLeaguevine;
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

	public String getSeason() {
		return season;
	}

	public void setSeason(String season) {
		this.season = season;
	}

	public boolean isPrivate() {
		return isPrivate;
	}

	public void setPrivate(boolean isPrivate) {
		this.isPrivate = isPrivate;
	}

	public boolean isDeleted() {
		return isDeleted;
	}

	public void setDeleted(boolean isDeleted) {
		this.isDeleted = isDeleted;
	}

}
