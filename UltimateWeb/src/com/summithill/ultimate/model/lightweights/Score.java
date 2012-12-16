package com.summithill.ultimate.model.lightweights;

import org.codehaus.jackson.annotate.JsonIgnore;

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
	public int combinedScore(){
		return ours + theirs;
	}
	@JsonIgnore
	public int highestScore(){
		return Math.max(ours, theirs);
	}
	
}
