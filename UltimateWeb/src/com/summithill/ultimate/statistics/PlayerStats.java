package com.summithill.ultimate.statistics;

import org.codehaus.jackson.annotate.JsonIgnore;

public class PlayerStats {
	private String playerName;
	private int plusMinusCount;
	private int plusMinusOLine;
	private int plusMinusDLine;
	private int gamesPlayed;
	private float pointsPlayed;
	private float oPointsPlayed;
	private float dPointsPlayed;
	private int goals;
	private int callahans;
	private int callahaneds;
	private int assists;
	private int passes;
	private int passSuccess;
	private int catches;
	private int catchSuccess;
	private int drops;
	private int throwaways;
	private int stalls;
	private int miscPenalties;
	private int ds;
	private int pulls;
	private int pullsWithHangtime;
	private int pullsOB;
	private int pullsAvgHangtimeMillis;
	private int touches;
	private int secondsPlayed;
	@JsonIgnore
	private int pullsTotalHangtime = 0;
	
	public PlayerStats(String playerName) {
		super();
		this.playerName = playerName;
	}
	
	public void incGamesPlayed() {
		this.gamesPlayed++;
	}
	public void incPointsPlayed() {
		this.pointsPlayed++;
	}	
	public void incPointsPlayedPartial() {
		this.pointsPlayed = this.pointsPlayed + .5f;
	}	
	public void incOPointsPlayed() {
		this.oPointsPlayed++;
	}
	public void incOPointsPlayedPartial() {
		this.oPointsPlayed = this.oPointsPlayed + .5f;
	}
	public void incDPointsPlayed() {
		this.dPointsPlayed++;
	}
	public void incDPointsPlayedPartial() {
		this.dPointsPlayed = this.dPointsPlayed + .5f;
	}
	public void incGoals() {
		this.goals++;
	}
	public void incAssists() {
		this.assists++;
	}
	public void incPasses() {
		this.passes++;
	}
	public void incCatches() {
		this.catches++;
	}	
	public void incDrops() {
		this.drops++;
	}
	public void incThrowaways() {
		this.throwaways++;
	}
	public void incDs() {
		this.ds++;
	}
	public void incPulls() {
		this.pulls++;
	}
	public void incPulls(int hangtimeMilliseconds) {
		this.incPulls();
		if (hangtimeMilliseconds > 0) {
			this.pullsWithHangtime++;
			this.pullsTotalHangtime += hangtimeMilliseconds;
			this.pullsAvgHangtimeMillis = this.pullsTotalHangtime / this.pullsWithHangtime;
		} 
	}
	public void incPullOBs() {
		this.pullsOB++;
	}	
	public void incTouches() {
		this.touches++;
	}
	public void incCallahans() {
		this.callahans++;
	}
	public void incCallahaneds() {
		this.callahaneds++;
	}	
	public void incStalls() {
		this.stalls++;
	}
	public void incMiscPenalties() {
		this.miscPenalties++;
	}
	public void incPlusMinusCount() {
		this.plusMinusCount++;
	}
	public void decPlusMinusCount() {
		this.plusMinusCount--;
	}	
	public void addSecondsPlayed(long seconds) {
		this.secondsPlayed += seconds;
	}
	public float getPointsPlayed() {
		return pointsPlayed;
	}
	public void setPointsPlayed(float pointsPlayed) {
		this.pointsPlayed = pointsPlayed;
	}
	public float getOPointsPlayed() {
		return oPointsPlayed;
	}
	public void setOPointsPlayed(float oPointsPlayed) {
		this.oPointsPlayed = oPointsPlayed;
	}
	public float getDPointsPlayed() {
		return dPointsPlayed;
	}
	public void setDPointsPlayed(float dPointsPlayed) {
		this.dPointsPlayed = dPointsPlayed;
	}
	public int getGoals() {
		return goals;
	}
	public void setGoals(int goals) {
		this.goals = goals;
	}
	public int getAssists() {
		return assists;
	}
	public void setAssists(int assists) {
		this.assists = assists;
	}
	public int getPasses() {
		return passes;
	}
	public void setPasses(int passes) {
		this.passes = passes;
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
	public int getPasserTurnovers() {
		return this.getThrowaways() + this.getStalls() + this.getMiscPenalties();
	}
	public void setThrowaways(int throwaways) {
		this.throwaways = throwaways;
	}
	public int getDs() {
		return ds;
	}
	public void setDs(int ds) {
		this.ds = ds;
	}
	public int getPulls() {
		return pulls;
	}
	public void setPulls(int pulls) {
		this.pulls = pulls;
	}
	public String getPlayerName() {
		return playerName;
	}
	public void setPlayerName(String playerName) {
		this.playerName = playerName;
	}

	public int getCatches() {
		return catches;
	}

	public void setCatches(int catches) {
		this.catches = catches;
	}

	public int getGamesPlayed() {
		return gamesPlayed;
	}

	public void setGamesPlayed(int gamesPlayed) {
		this.gamesPlayed = gamesPlayed;
	}

	public int getTouches() {
		return touches;
	}

	public void setTouches(int touches) {
		this.touches = touches;
	}

	public int getSecondsPlayed() {
		return secondsPlayed;
	}

	public void setSecondsPlayed(int secondsPlayed) {
		this.secondsPlayed = secondsPlayed;
	}

	public int getPlusMinusCount() {
		return plusMinusCount;
	}

	public void setPlusMinusCount(int plusMinusCount) {
		this.plusMinusCount = plusMinusCount;
	}

	public int getPullsOB() {
		return pullsOB;
	}

	public void setPullsOB(int pullsOB) {
		this.pullsOB = pullsOB;
	}

	public int getPullsAvgHangtimeMillis() {
		return pullsAvgHangtimeMillis;
	}

	public void setPullsAvgHangtimeMillis(int avgHangtime) {
		this.pullsAvgHangtimeMillis = avgHangtime;
	}

	public int getPullsWithHangtime() {
		return pullsWithHangtime;
	}

	public void setPullsWithHangtime(int pullsWithHangtime) {
		this.pullsWithHangtime = pullsWithHangtime;
	}

	public int getPassSuccess() {
		return passSuccess;
	}

	public void setPassSuccess(int passSuccess) {
		this.passSuccess = passSuccess;
	}

	public int getCatchSuccess() {
		return catchSuccess;
	}

	public void setCatchSuccess(int catchSuccess) {
		this.catchSuccess = catchSuccess;
	}

	public int getPlusMinusOLine() {
		return plusMinusOLine;
	}
	
	public void incPlusMinusOLine() {
		plusMinusOLine++;
	}

	public void decPlusMinusOLine() {
		plusMinusOLine--;
	}
	
	public void setPlusMinusOLine(int plusMinusOLine) {
		this.plusMinusOLine = plusMinusOLine;
	}

	public int getPlusMinusDLine() {
		return plusMinusDLine;
	}

	public void incPlusMinusDLine() {
		plusMinusDLine++;
	}
	
	public void decPlusMinusDLine() {
		plusMinusDLine--;
	}
	
	public void setPlusMinusDLine(int plusMinusDLine) {
		this.plusMinusDLine = plusMinusDLine;
	}

	public int getStalls() {
		return stalls;
	}

	public void setStalls(int stalls) {
		this.stalls = stalls;
	}

	public int getMiscPenalties() {
		return miscPenalties;
	}

	public void setMiscPenalties(int miscPenalties) {
		this.miscPenalties = miscPenalties;
	}

	public int getCallahans() {
		return callahans;
	}

	public void setCallahans(int callahans) {
		this.callahans = callahans;
	}
	
	public int getCallahaneds() {
		return callahaneds;
	}

	public void setCallahaneds(int callahaneds) {
		this.callahaneds = callahaneds;
	}
}
