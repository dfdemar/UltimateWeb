package com.summithill.ultimate.controller;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.summithill.ultimate.service.GameVersionInfo;

@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
public class ParameterGameVersion  {
	private long keyIdentifier;
	private String description;
	private String lastUpdtateUtc;
	private Long ourScore;
	private Long theirScore;
	
	public static ParameterGameVersion fromGameVersionInfo(GameVersionInfo gameVersionInfo) {
		ParameterGameVersion pGameVersion = new ParameterGameVersion();
		pGameVersion.setKeyIdentifier(gameVersionInfo.getKeyIdentifier());
		pGameVersion.setLastUpdtateUtc(gameVersionInfo.getLastUpdtateUtc());
		pGameVersion.setDescription(gameVersionInfo.getDescription());
		pGameVersion.setOurScore(gameVersionInfo.getOurScore());
		pGameVersion.setTheirScore(gameVersionInfo.getTheirScore());
		return pGameVersion;
	}
		
	public long getKeyIdentifier() {
		return keyIdentifier;
	}
	public void setKeyIdentifier(long keyIdentifier) {
		this.keyIdentifier = keyIdentifier;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getLastUpdtateUtc() {
		return lastUpdtateUtc;
	}
	public void setLastUpdtateUtc(String lastUpdtateUtc) {
		this.lastUpdtateUtc = lastUpdtateUtc;
	}
	public Long getOurScore() {
		return ourScore;
	}
	public void setOurScore(Long ourScore) {
		this.ourScore = ourScore;
	}
	public Long getTheirScore() {
		return theirScore;
	}
	public void setTheirScore(Long theirScore) {
		this.theirScore = theirScore;
	}
	
}
