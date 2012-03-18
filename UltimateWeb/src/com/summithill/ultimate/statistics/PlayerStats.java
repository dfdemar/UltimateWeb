package com.summithill.ultimate.statistics;

public class PlayerStats {
	private String playerName;
	private int gamesPlayed;
	private int pointsPlayed;
	private int oPointsPlayed;
	private int dPointsPlayed;
	private int goals;
	private int assists;
	private int passes;
	private int catches;
	private int drops;
	private int throwaways;
	private int ds;
	private int pulls;
	
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
	public void incOPointsPlayed() {
		this.oPointsPlayed++;
	}
	public void incDPointsPlayed() {
		this.dPointsPlayed++;
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
	
	public int getPointsPlayed() {
		return pointsPlayed;
	}
	public void setPointsPlayed(int pointsPlayed) {
		this.pointsPlayed = pointsPlayed;
	}
	public int getOPointsPlayed() {
		return oPointsPlayed;
	}
	public void setOPointsPlayed(int oPointsPlayed) {
		this.oPointsPlayed = oPointsPlayed;
	}
	public int getDPointsPlayed() {
		return dPointsPlayed;
	}
	public void setDPointsPlayed(int dPointsPlayed) {
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
}
