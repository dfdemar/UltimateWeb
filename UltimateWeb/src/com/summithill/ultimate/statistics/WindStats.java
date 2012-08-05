package com.summithill.ultimate.statistics;

public class WindStats {
	private int goalOpportunties = 0;
	private int goalsWindUnknown = 0;
	private int goalsWithWind = 0;
	private int goalsAgainstWind = 0;
	private int goalsAcrossWind = 0;
	
	public void incrementGoalsWithWind() {
		goalsWithWind++;
	}
	public void incrementGoalsAgainstWind() {
		goalsAgainstWind++;
	}
	public void incrementGoalsAcrossWind() {
		goalsAcrossWind++;
	}	
	public void incrementGoalsWindUnknown() {
		goalsWindUnknown++;
	}	
	public void incrementGoalOpportunties() {
		goalOpportunties++;
	}		
	public int getGoalsWithWind() {
		return goalsWithWind;
	}
	public void setGoalsWithWind(int goalsWithWind) {
		this.goalsWithWind = goalsWithWind;
	}
	public int getGoalsAgainstWind() {
		return goalsAgainstWind;
	}
	public void setGoalsAgainstWind(int goalsAgainstWind) {
		this.goalsAgainstWind = goalsAgainstWind;
	}
	public int getGoalsAcrossWind() {
		return goalsAcrossWind;
	}
	public void setGoalsAcrossWind(int goalsAcrossWind) {
		this.goalsAcrossWind = goalsAcrossWind;
	}
	public int getGoalOpportunties() {
		return goalOpportunties;
	}
	public void setGoalOpportunties(int goalOpportunties) {
		this.goalOpportunties = goalOpportunties;
	}
	public int getGoalsWindUnknown() {
		return goalsWindUnknown;
	}
	public void setGoalsWindUnknown(int goalsWindUnknown) {
		this.goalsWindUnknown = goalsWindUnknown;
	}
}
