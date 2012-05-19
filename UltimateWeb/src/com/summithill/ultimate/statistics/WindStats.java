package com.summithill.ultimate.statistics;

public class WindStats {
	private int goalsWithWind;
	private int goalsAgainstWind;
	private int goalsAcrossWind;
	
	public void incrementGoalsWithWind() {
		goalsWithWind++;
	}
	public void incrementGoalsAgainstWind() {
		goalsAgainstWind++;
	}
	public void incrementGoalsAcrossWind() {
		goalsAcrossWind++;
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
}
