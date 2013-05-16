package com.summithill.ultimate.controller;

import java.io.Reader;
import java.io.Writer;
import java.security.MessageDigest;

import org.codehaus.jackson.annotate.JsonIgnore;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.annotate.JsonSerialize;

@JsonIgnoreProperties(ignoreUnknown=true)
@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
public class GameExport {
	private static String SEED = "iUltimate";
	private String teamJson;
	private String gameJson;
	private String hash;
	
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
	public String getHash() {
		return hash;
	}
	public void setHash(String hash) {
		this.hash = hash;
	}
	
	
	@JsonIgnore
	public static GameExport from(ParameterTeam team, ParameterGame game) {
	    try {
			GameExport export = new GameExport();
			export.setTeamJson(new ObjectMapper().writeValueAsString(team));
			export.setGameJson(new ObjectMapper().writeValueAsString(game));
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
