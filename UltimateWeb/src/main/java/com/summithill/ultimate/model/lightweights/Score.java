package com.summithill.ultimate.model.lightweights;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown=true)
public class Score {
	private int ours;
	private int theirs;
	public int getOurs() {
		return ours;
	}
	public void setOurs(int ours) {
		this.ours = ours;
	}
	public int getTheirs() {
		return theirs;
	}
	public void setTheirs(int theirs) {
		this.theirs = theirs;
	}
	
	@JsonIgnore
	public int combinedScore(){
		return ours + theirs;
	}
	@JsonIgnore
	public int highestScore(){
		return Math.max(ours, theirs);
	}
	
}
