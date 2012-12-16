package com.summithill.ultimate.model.lightweights;

import org.codehaus.jackson.annotate.JsonIgnore;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonSerialize;

@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
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
