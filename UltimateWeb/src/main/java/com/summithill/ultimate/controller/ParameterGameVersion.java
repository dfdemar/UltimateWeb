package com.summithill.ultimate.controller;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.summithill.ultimate.service.GameVersionInfo;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ParameterGameVersion  {
	private long keyIdentifier;
	private String description;
	private String updateUtc;
	private Long ourScore;
	private Long theirScore;
	private boolean isCurrentVersion;
	
	public static ParameterGameVersion fromGameVersionInfo(GameVersionInfo gameVersionInfo) {
		ParameterGameVersion pGameVersion = new ParameterGameVersion();
		pGameVersion.setKeyIdentifier(gameVersionInfo.getKeyIdentifier());
		pGameVersion.setUpdateUtc(gameVersionInfo.getUpdtateUtc());
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
	public String getUpdateUtc() {
		return updateUtc;
	}
	public void setUpdateUtc(String lastUpdtateUtc) {
		this.updateUtc = lastUpdtateUtc;
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
	public boolean isCurrentVersion() {
		return isCurrentVersion;
	}
	public void setCurrentVersion(boolean isCurrentVersion) {
		this.isCurrentVersion = isCurrentVersion;
	}
	
}
