package com.summithill.ultimate.statistics;

public class TrendPoint {
	private String gameDescription;
	private int touches;
	private int drops;
	private int throwaways;
	private int turnovers;
	
	public void incrementTouches() {
		touches++;
	}
	public void incrementDrops() {
		drops++;
		turnovers++;
	}
	public void incrementThroways() {
		throwaways++;
		turnovers++;
	}
	public String getGameDescription() {
		return gameDescription;
	}
	public void setGameDescription(String gameDescription) {
		this.gameDescription = gameDescription;
	}
	public int getTouches() {
		return touches;
	}
	public void setTouches(int touches) {
		this.touches = touches;
	}
	public int getDrops() {
		return drops;
	}
	public void setDrops(int drops) {
		this.drops = drops;
	}
	public int getThrowaways() {
		return throwaways;
	}
	public void setThrowaways(int throwaways) {
		this.throwaways = throwaways;
	}
	public int getTurnovers() {
		return turnovers;
	}
	public void setTurnovers(int turnovers) {
		this.turnovers = turnovers;
	}
}
