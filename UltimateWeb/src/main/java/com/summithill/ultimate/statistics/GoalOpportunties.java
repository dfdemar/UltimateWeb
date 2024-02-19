package com.summithill.ultimate.statistics;

public class GoalOpportunties {
	private int goals;
	private int opportunties;
		
	public void incrementGoals() {
		goals++;
	}
	public void incrementOpportunties() {
		opportunties++;
	}
	public int getGoals() {
		return goals;
	}
	public void setGoals(int goals) {
		this.goals = goals;
	}
	public int getOpportunties() {
		return opportunties;
	}
	public void setOpportunties(int opportunties) {
		this.opportunties = opportunties;
	}
	public float getGoalsPerOpportunity() {
		return opportunties == 0 ? 0 : (float)goals / (float)opportunties;
	}
}
