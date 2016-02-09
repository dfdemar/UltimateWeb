package com.summithill.ultimate.model.lightweights;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown=true)
public class PointSummary {
	public static final String O_LINE = "O";
	public static final String D_LINE = "D";
	private static final long UNREASONABLY_LONG_ELAPSED_TIME_MINUTES = 60; 
	private static final long DEFAULT_POINT_ELAPSED_MINUTES = 5; 
	
	private Score score;
	private String lineType;
	private boolean finished;
	private long elapsedTime;  // seconds
	@JsonIgnore
	private boolean directionChanged;  // did at least one direction change during point?
	@JsonIgnore
	private boolean isOurGoal;
	
	@JsonIgnore
	public boolean isOline() {
		return lineType.equals(O_LINE);
	}
	
	@JsonIgnore
	public boolean isDline() {
		return ! isOline();
	}
	
	public Score getScore() {
		return score;
	}
	public void setScore(Score score) {
		this.score = score;
	}
	public String getLineType() {
		return lineType;
	}
	public void setLineType(String lineType) {
		this.lineType = lineType;
	}
	public boolean isFinished() {
		return finished;
	}
	public void setFinished(boolean finished) {
		this.finished = finished;
	}
	public long getElapsedTime() {
		return elapsedTime;
	}
	// answer actual elapsed time unless the time is unreasonably long (suggesting game not started at correct time) in which case
	// return an estimate
	@JsonIgnore
	public long getAdjustedElapsedTime() {
		return elapsedTime > UNREASONABLY_LONG_ELAPSED_TIME_MINUTES * 60 ? DEFAULT_POINT_ELAPSED_MINUTES * 60 : elapsedTime; 
	}
	public void setElapsedTime(long elapsedTime) {
		this.elapsedTime = elapsedTime;
	}

	@JsonIgnore
	public boolean didDirectionChange() {
		return directionChanged;
	}
	
	public boolean getDirectionChanged() {
		return directionChanged;
	}

	public void setDirectionChanged(boolean directionChanged) {
		this.directionChanged = directionChanged;
	}

	@JsonIgnore
	public boolean isOurGoal() {
		return isOurGoal;
	}

	@JsonIgnore
	public void setOurGoal(boolean isOurGoal) {
		this.isOurGoal = isOurGoal;
	}
}
