package com.summithill.ultimate.statistics;

public class BreakSummary {
	private BreakDetails ourBreakDetails = new BreakDetails();
	private BreakDetails theirBreakDetails = new BreakDetails();
	
	public BreakDetails getOurBreakDetails() {
		return ourBreakDetails;
	}
	public void setOurBreakDetails(BreakDetails ourBreakDetails) {
		this.ourBreakDetails = ourBreakDetails;
	}
	public BreakDetails getTheirBreakDetails() {
		return theirBreakDetails;
	}
	public void setTheirBreakDetails(BreakDetails theirBreakDetails) {
		this.theirBreakDetails = theirBreakDetails;
	}
}
