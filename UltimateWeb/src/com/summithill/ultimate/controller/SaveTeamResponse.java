package com.summithill.ultimate.controller;

public class SaveTeamResponse {
	private String cloudId;

	public SaveTeamResponse(String teamId) {
		super();
		this.cloudId = teamId;
	}
	
	public SaveTeamResponse(long teamId) {
		this(Long.toString(teamId));
	}

	public String getCloudId() {
		return cloudId;
	}

	public void setCloudId(String cloudId) {
		this.cloudId = cloudId;
	}
	

}
