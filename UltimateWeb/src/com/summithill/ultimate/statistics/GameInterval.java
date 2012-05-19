package com.summithill.ultimate.statistics;

/*
 * Knows the stats for a given interval of time (e.g. first 5% of a game)
 */

public class GameInterval {
	private float touchesPerPoint;
	private float dropsPerPoint;
	private float throwawaysPerPoint;
	private float turnoversPerPoint;
	
	public float getTouchesPerPoint() {
		return touchesPerPoint;
	}
	public void setTouchesPerPoint(float touchesPerPoint) {
		this.touchesPerPoint = touchesPerPoint;
	}
	public float getDropsPerPoint() {
		return dropsPerPoint;
	}
	public void setDropsPerPoint(float dropsPerPoint) {
		this.dropsPerPoint = dropsPerPoint;
	}
	public float getThrowawaysPerPoint() {
		return throwawaysPerPoint;
	}
	public void setThrowawaysPerPoint(float throwawaysPerPoint) {
		this.throwawaysPerPoint = throwawaysPerPoint;
	}
	public float getTurnoversPerPoint() {
		return turnoversPerPoint;
	}
	public void setTurnoversPerPoint(float turnoversPerPoint) {
		this.turnoversPerPoint = turnoversPerPoint;
	}
}
