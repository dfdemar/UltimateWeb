package com.summithill.ultimate.statistics;

public class WindEffect {
	private int windSpeed;
	private WindStats ourStats = new WindStats();
	private WindStats theirStats = new WindStats();
	public int getWindSpeed() {
		return windSpeed;
	}
	public void setWindSpeed(int windSpeed) {
		this.windSpeed = windSpeed;
	}
	public WindStats getOurStats() {
		return ourStats;
	}
	public void setOurStats(WindStats ourStats) {
		this.ourStats = ourStats;
	}
	public WindStats getTheirStats() {
		return theirStats;
	}
	public void setTheirStats(WindStats theirStats) {
		this.theirStats = theirStats;
	}
}
