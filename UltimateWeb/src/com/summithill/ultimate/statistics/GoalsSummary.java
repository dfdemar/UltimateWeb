package com.summithill.ultimate.statistics;

public class GoalsSummary {
	private int ourOlineGoals;
	private int theirOlineGoals;
	private int ourDlineGoals;
	private int theirDlineGoals;
	
	public void incrementOurOlineGoals() {
		ourOlineGoals++;
	}

	public void incrementOurDlineGoals() {
		ourDlineGoals++;
	}
	
	public void incrementTheirOlineGoals() {
		theirOlineGoals++;
	}
	
	public void incrementTheirDlineGoals() {
		theirDlineGoals++;
	}
	
	public int getOurOlineGoals() {
		return ourOlineGoals;
	}
	public void setOurOlineGoals(int ourOlineGoals) {
		this.ourOlineGoals = ourOlineGoals;
	}
	public int getTheirOlineGoals() {
		return theirOlineGoals;
	}
	public void setTheirOlineGoals(int theirOlineGoals) {
		this.theirOlineGoals = theirOlineGoals;
	}
	public int getOurDlineGoals() {
		return ourDlineGoals;
	}
	public void setOurDlineGoals(int ourDlineGoals) {
		this.ourDlineGoals = ourDlineGoals;
	}
	public int getTheirDlineGoals() {
		return theirDlineGoals;
	}
	public void setTheirDlineGoals(int theirDlineGoals) {
		this.theirDlineGoals = theirDlineGoals;
	}

}
