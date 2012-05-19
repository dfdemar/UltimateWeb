package com.summithill.ultimate.statistics;

public class TrendPoint {
	private String gameDescription;
	private int touches;
	private int touchesPerPoint;
	private int drops;
	private int dropsPerPoint;
	private int throwaways;
	private int throwawaysPerPoint;
	private int turnovers;
	private int turnoversPerPoint;
	
	public void incrementTouches() {
		touches++;
	}
	public void incrementDrops() {
		touches++;
	}
	public void incrementThroways() {
		touches++;
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
	public int getTouchesPerPoint() {
		return touchesPerPoint;
	}
	public void setTouchesPerPoint(int touchesPerPoint) {
		this.touchesPerPoint = touchesPerPoint;
	}
	public int getDrops() {
		return drops;
	}
	public void setDrops(int drops) {
		this.drops = drops;
	}
	public int getDropsPerPoint() {
		return dropsPerPoint;
	}
	public void setDropsPerPoint(int dropsPerPoint) {
		this.dropsPerPoint = dropsPerPoint;
	}
	public int getThrowaways() {
		return throwaways;
	}
	public void setThrowaways(int throwaways) {
		this.throwaways = throwaways;
	}
	public int getThrowawaysPerPoint() {
		return throwawaysPerPoint;
	}
	public void setThrowawaysPerPoint(int throwawaysPerPoint) {
		this.throwawaysPerPoint = throwawaysPerPoint;
	}
	public int getTurnovers() {
		return turnovers;
	}
	public void setTurnovers(int turnovers) {
		this.turnovers = turnovers;
	}
	public int getTurnoversPerPoint() {
		return turnoversPerPoint;
	}
	public void setTurnoversPerPoint(int turnoversPerPoint) {
		this.turnoversPerPoint = turnoversPerPoint;
	}	
}
