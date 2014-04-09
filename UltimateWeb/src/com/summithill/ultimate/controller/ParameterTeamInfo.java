package com.summithill.ultimate.controller;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.summithill.ultimate.model.Team;

@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
public class ParameterTeamInfo {
	private String cloudId;
	private String name;
	private boolean isMixed;
	private boolean isPasswordProtected;
	
	public static ParameterTeamInfo fromTeam(Team team) {
		ParameterTeamInfo pTeam = new ParameterTeamInfo();
		pTeam.setCloudId(team.getPersistenceId());
		pTeam.setName(team.getName());
		pTeam.setMixed(team.isMixed());
		pTeam.setPasswordProtected(team.hasPassword());
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
}
