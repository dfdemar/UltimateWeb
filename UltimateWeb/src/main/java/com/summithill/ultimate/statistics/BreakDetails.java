package com.summithill.ultimate.statistics;

public class BreakDetails {
	private int olineBroken;
	private int olineBrokenThenScores;
	private int dlineBreaks;
	private int dlineBreaksThenScoredUpon;
	
	public void incOlineBroken() {
		olineBroken++;
	}
	public void incOlineBrokenThenScores() {
		olineBrokenThenScores++;
	}
	public void incDlineBreaks() {
		dlineBreaks++;
	}
	public void incDlineBreaksThenScoredUpon() {
		dlineBreaksThenScoredUpon++;
	}
	public int getOlineBroken() {
		return olineBroken;
	}
	public void setOlineBroken(int olineBroken) {
		this.olineBroken = olineBroken;
	}
	public int getOlineBrokenThenScores() {
		return olineBrokenThenScores;
	}
	public void setOlineBrokenThenScores(int olineBrokenThenScores) {
		this.olineBrokenThenScores = olineBrokenThenScores;
	}
	public int getDlineBreaks() {
		return dlineBreaks;
	}
	public void setDlineBreaks(int dlineBreaks) {
		this.dlineBreaks = dlineBreaks;
	}
	public int getDlineBreaksThenScoredUpon() {
		return dlineBreaksThenScoredUpon;
	}
	public void setDlineBreaksThenScoredUpon(int dlineBreaksThenScoredUpon) {
		this.dlineBreaksThenScoredUpon = dlineBreaksThenScoredUpon;
	}
}
