package com.summithill.ultimate.statistics;

/*
 * Knows the stats for a given interval of time (e.g. first 5% of a game)
 */

public class TrendPoint {
	private String gameDescription;
	private float touches;
	private float drops;
	private float throwaways;
	private float turnovers;
	private float turnoversPerTouch;
	
	public void incrementTouches() {
		touches++;
	}
	
	public void incrementDrops() {
		drops++;
		turnovers++;
	}
	
	public void incrementThrowaways() {
		throwaways++;
		turnovers++;
	}
	
	public void calculateTurnoversPerTouch() {
		if (touches > 0) {
			turnoversPerTouch = turnovers / touches;
		}
	}
	
	public float getTouches() {
		return touches;
	}
	public void setTouches(float touches) {
		this.touches = touches;
	}
	public float getDrops() {
		return drops;
	}
	public void setDrops(float drops) {
		this.drops = drops;
	}
	public float getThrowaways() {
		return throwaways;
	}
	public void setThrowaways(float throwaways) {
		this.throwaways = throwaways;
	}
	public float getTurnovers() {
		return turnovers;
	}
	public void setTurnovers(float turnovers) {
		this.turnovers = turnovers;
	}
	public float getTurnoversPerTouch() {
		return turnoversPerTouch;
	}
	public void setTurnoversPerTouch(float turnoversPerTouch) {
		this.turnoversPerTouch = turnoversPerTouch;
	}

	public String getGameDescription() {
		return gameDescription;
	}

	public void setGameDescription(String gameDescription) {
		this.gameDescription = gameDescription;
	}
}
