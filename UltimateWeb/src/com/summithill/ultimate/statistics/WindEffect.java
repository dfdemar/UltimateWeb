package com.summithill.ultimate.statistics;

public class WindEffect {
	private WindSpeedRange speedRange;
	private WindStats ourStats = new WindStats();
	private WindStats theirStats = new WindStats();

	public WindEffect(WindSpeedRange speedRange) {
		super();
		this.speedRange = speedRange;
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
	public WindSpeedRange getSpeedRange() {
		return speedRange;
	}
	public void setSpeedRange(WindSpeedRange speedRange) {
		this.speedRange = speedRange;
	}
}
