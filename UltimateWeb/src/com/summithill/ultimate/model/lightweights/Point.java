package com.summithill.ultimate.model.lightweights;

import java.util.List;

public class Point {
	private List<Event> events;
	private List<String> line;
	private long startSeconds;
	private long endSeconds;
	private PointSummary summary;
	
	public boolean isOurPoint(Point lastPoint) {
		Score currentScore = this.getSummary().getScore();
		if (lastPoint == null) {
			return currentScore.getOurs() > currentScore.getTheirs();
		} else {
			return currentScore.getOurs() > lastPoint.getSummary().getScore().getOurs();
		}
	}
	
	public List<Event> getEvents() {
		return events;
	}
	public void setEvents(List<Event> events) {
		this.events = events;
	}
	public List<String> getLine() {
		return line;
	}
	public void setLine(List<String> line) {
		this.line = line;
	}
	public PointSummary getSummary() {
		return summary;
	}
	public void setSummary(PointSummary summary) {
		this.summary = summary;
	}
	public long getStartSeconds() {
		return startSeconds;
	}
	public void setStartSeconds(long startSeconds) {
		this.startSeconds = startSeconds;
	}
	public long getEndSeconds() {
		return endSeconds;
	}
	public void setEndSeconds(long endSeconds) {
		this.endSeconds = endSeconds;
	}
}
