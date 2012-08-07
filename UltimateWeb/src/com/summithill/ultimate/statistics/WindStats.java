package com.summithill.ultimate.statistics;

public class WindStats {
	private GoalOpportunties goalsWindUnknown = new GoalOpportunties();
	private GoalOpportunties goalsWithWind = new GoalOpportunties();
	private GoalOpportunties goalsAgainstWind = new GoalOpportunties();
	private GoalOpportunties goalsAcrossWind = new GoalOpportunties();
	
	public GoalOpportunties getGoalsWindUnknown() {
		return goalsWindUnknown;
	}
	public void setGoalsWindUnknown(GoalOpportunties goalsWindUnknown) {
		this.goalsWindUnknown = goalsWindUnknown;
	}
	public GoalOpportunties getGoalsWithWind() {
		return goalsWithWind;
	}
	public void setGoalsWithWind(GoalOpportunties goalsWithWind) {
		this.goalsWithWind = goalsWithWind;
	}
	public GoalOpportunties getGoalsAgainstWind() {
		return goalsAgainstWind;
	}
	public void setGoalsAgainstWind(GoalOpportunties goalsAgainstWind) {
		this.goalsAgainstWind = goalsAgainstWind;
	}
	public GoalOpportunties getGoalsAcrossWind() {
		return goalsAcrossWind;
	}
	public void setGoalsAcrossWind(GoalOpportunties goalsAcrossWind) {
		this.goalsAcrossWind = goalsAcrossWind;
	}
	

}
