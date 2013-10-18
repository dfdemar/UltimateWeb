package com.summithill.ultimate.controller;

import java.io.Reader;
import java.io.Writer;
import java.security.MessageDigest;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;


@JsonIgnoreProperties(ignoreUnknown=true)
@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
public class GameExport {
	private static String SEED = "iUltimate";
	private String teamJson;
	private String gameJson;
	private String hash;
	private String dateExported;
	private String userThatExported;
	
	public String getTeamJson() {
		return teamJson;
	}
	public void setTeamJson(String teamJson) {
		this.teamJson = teamJson;
	}
	public String getGameJson() {
		return gameJson;
	}
	public void setGameJson(String gameJson) {
		this.gameJson = gameJson;
	}
	public String getDateExported() {
		return dateExported;
	}
	public void setDateExported(String dateExported) {
		this.dateExported = dateExported;
	}
	public String getUserThatExported() {
		return userThatExported;
	}
	public void setUserThatExported(String userThatExported) {
		this.userThatExported = userThatExported;
	}
	public String getHash() {
		return hash;
	}
	public void setHash(String hash) {
		this.hash = hash;
	}
	
	@JsonIgnore
	public static GameExport from(ParameterTeam team, ParameterGame game, String userEmail) {
	    try {
			GameExport export = new GameExport();
			export.setTeamJson(new ObjectMapper().writeValueAsString(team));
			export.setGameJson(new ObjectMapper().writeValueAsString(game));
			export.setDateExported(new Date().toString());
			export.setUserThatExported(userEmail);
			export.updateHash();
			return export;
		} catch (Exception e) {
			throw new RuntimeException("Error calculating hash of export", e);
		}
	}
	
	@JsonIgnore
	public static GameExport fromJsonString(String json) {
	    try {
	    	return new ObjectMapper().readValue(json, GameExport.class);
		} catch (Exception e) {
			throw new RuntimeException("Error writing export json", e);
		}
	}
	
	@JsonIgnore
	public static GameExport fromJsonReader(Reader jsonReader) {
	    try {
	    	return new ObjectMapper().readValue(jsonReader, GameExport.class);
		} catch (Exception e) {
			throw new RuntimeException("Error writing export json", e);
		}
	}
	
	@JsonIgnore
	public void writeJsonString(Writer writer) {
	    try {
	    	new ObjectMapper().writeValue(writer, this);
		} catch (Exception e) {
			throw new RuntimeException("Error writing export json", e);
		}
	}
	
	@JsonIgnore
	public String asJsonString() {
	    try {
	    	return new ObjectMapper().writeValueAsString(this);
		} catch (Exception e) {
			throw new RuntimeException("Error writing export json", e);
		}
	}
	
	@JsonIgnore
	public void updateHash() {
		this.hash = this.calculateHash();
	}
	
	@JsonIgnore
	public boolean verifyHash() {
	    String hashOfCurrentValues = this.calculateHash();
	    return hashOfCurrentValues.equals(hash);
	}
	
	@JsonIgnore
	private String calculateHash() {
	    try {
			MessageDigest md = MessageDigest.getInstance("MD5");
			md.update(SEED.getBytes());
			if (teamJson != null) {
				md.update(teamJson.getBytes());
			}
			if (gameJson != null) {
				md.update(gameJson.getBytes());
			}
			if (dateExported != null) {
				md.update(dateExported.getBytes());
			}
			if (userThatExported != null) {
				md.update(userThatExported.getBytes());
			}
			byte[] mdbytes = md.digest();
			
			//convert the digest bytes to hex format 
	        StringBuffer sb = new StringBuffer();
	        for (int i = 0; i < mdbytes.length; i++) {
	          sb.append(Integer.toString((mdbytes[i] & 0xff) + 0x100, 16).substring(1));
	        }
	        
	        return sb.toString();
		} catch (Exception e) {
			throw new RuntimeException("Error calculating hash of export", e);
		}
	}
}
