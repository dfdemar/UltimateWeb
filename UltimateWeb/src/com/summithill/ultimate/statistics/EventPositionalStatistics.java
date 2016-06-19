package com.summithill.ultimate.statistics;

import com.summithill.ultimate.model.lightweights.EventPosition;

public class EventPositionalStatistics {
	private EventPosition beginPosition;
	private EventPosition endPosition;
	private float distance;
	private float distanceTowardGoal;
	private float distanceLateral;
	
	public float getDistance() {
		return distance;
	}
	public EventPosition getBeginPosition() {
		return beginPosition;
	}
	public void setBeginPosition(EventPosition beginPosition) {
		this.beginPosition = beginPosition;
	}
	public EventPosition getEndPosition() {
		return endPosition;
	}
	public void setEndPosition(EventPosition endPosition) {
		this.endPosition = endPosition;
	}
	public void setDistance(float distance) {
		this.distance = distance;
	}
	public float getDistanceTowardGoal() {
		return distanceTowardGoal;
	}
	public void setDistanceTowardGoal(float distanceTowardGoal) {
		this.distanceTowardGoal = distanceTowardGoal;
	}
	public float getDistanceLateral() {
		return distanceLateral;
	}
	public void setDistanceLateral(float distanceLateral) {
		this.distanceLateral = distanceLateral;
	}
}
