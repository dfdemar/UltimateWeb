package com.summithill.ultimate.model.lightweights;

import java.util.List;

public class Point {
	private List<Event> events;
	private List<String> line;
	private PointSummary summary;
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
}
