package com.summithill.ultimate.model.lightweights;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;


@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown=true)
public class Event {
	public static String OFFENSE = "Offense";
	public static String DEFENSE = "Defense";
	public static String CESSATION = "Cessation";
	
	public static String GOAL = "Goal";
	public static String CALLAHAN = "Callahan";
	public static String CATCH = "Catch";
	public static String D = "D";
	public static String DROP = "Drop";
	public static String THROWAWAY = "Throwaway";
	public static String STALL = "Stall";
	public static String MISC_PENALTY = "MiscPenalty";
	public static String PULL = "Pull";
	public static String PULL_OB = "PullOb";
	
	public static String OPPONENT_PULL = "OpponentPull";
	public static String OPPONENT_PULL_OB = "OpponentPullOb";
	public static String OPPONENT_CATCH = "OpponentCatch";
	
	public static String EO_1Q = "EndOfFirstQuarter";
	public static String EO_3Q = "EndOfThirdQuarter";
	public static String EO_4Q = "EndOfFourthQuarter";
	public static String EO_OVERTIME = "EndOfOvertime";
	public static String HALFTIME = "Halftime";
	public static String GAME_OVER = "GameOver";
	public static String TIMEOUT = "Timeout";
	
	public static String DETAILS = "details";
	
	private String type;
	private String action;
	private String defender;
	private String passer;
	private String receiver;
	private double	timestamp; 
	private EventDetails details;
	private EventPosition pos;
	private EventPosition posBegin;
	
	public String getType() {
		return type;
	}
	
	@JsonIgnore
	public boolean isPlayEvent() {
		return this.isOffense() || this.isDefense();
	}
	
	@JsonIgnore
	public boolean isGoal() {
		return action.equals(GOAL);
	}
	
	@JsonIgnore
	public boolean isCallahan() {
		return action.equals(CALLAHAN);
	}
	
	@JsonIgnore
	public boolean isOffense() {
		return type.equals(OFFENSE);
	}
	
	@JsonIgnore
	public boolean isDefense() {
		return type.equals(DEFENSE);
	}
	
	@JsonIgnore
	public boolean isTurnover() {
		return this.isThrowaway() ||  this.isStall() || this.isMiscPenalty() || this.isD();
	}
	
	@JsonIgnore
	public boolean isThrowaway() {
		return action.equals(THROWAWAY);
	}
	
	@JsonIgnore
	public boolean isStall() {
		return action.equals(STALL);
	}
	
	@JsonIgnore
	public boolean isMiscPenalty() {
		return action.equals(MISC_PENALTY);
	}
	
	@JsonIgnore
	public boolean isD() {
		return action.equals(D);
	}
	
	@JsonIgnore
	public boolean isCatch() {
		return action.equals(CATCH);
	}
	
	@JsonIgnore
	public boolean isDrop() {
		return action.equals(DROP);
	}
	
	@JsonIgnore
	public boolean isPull() {
		return action.equals(PULL);
	}
	
	@JsonIgnore
	public boolean isPullOb() {
		return action.equals(PULL_OB);
	}
	
	@JsonIgnore
	public boolean isOpponentEvent() {
		return action.startsWith("Opponent");
	}
	
	@JsonIgnore
	public boolean isEndOfFirstQuarter() {
		return action.equals(EO_1Q);
	}
	
	@JsonIgnore
	public boolean isHalftime() {
		return action.equals(HALFTIME);
	}
	
	@JsonIgnore
	public boolean isEndOfThirdQuarter() {
		return action.equals(EO_3Q);
	}
	
	@JsonIgnore
	public boolean isGameOver() {
		return action.equals(GAME_OVER);
	}
	
	@JsonIgnore
	public boolean isTimeout() {
		return action.equals(TIMEOUT);
	}
	
	@JsonIgnore
	public boolean isFirstOffenseEvent(Event previousEvent) {
		return this.isOffense() && (previousEvent == null || !(previousEvent.isOffense()));
	}
	
	public void setType(String type) {
		this.type = type;
	}
	public String getAction() {
		return action;
	}
	public void setAction(String action) {
		this.action = action;
	}
	public String getDefender() {
		return defender;
	}
	public void setDefender(String defender) {
		this.defender = defender;
	}
	public String getPasser() {
		return passer;
	}
	public void setPasser(String passer) {
		this.passer = passer;
	}
	public String getReceiver() {
		return receiver;
	}
	public void setReceiver(String reciever) {
		this.receiver = reciever;
	}
	public double getTimestamp() {
		return timestamp;
	}
	public void setTimestamp(double timestamp) {
		this.timestamp = timestamp;
	}
	public EventDetails getDetails() {
		return details;
	}
	public void setDetails(EventDetails details) {
		this.details = details;
	}
	
	@JsonIgnore
	public void renamePlayer(String oldPlayerName, String newPlayerName) {
		if (this.defender != null && this.defender.equalsIgnoreCase(oldPlayerName)) {
			this.defender = newPlayerName;
		}
		if (this.passer != null && this.passer.equalsIgnoreCase(oldPlayerName)) {
			this.passer = newPlayerName;
		}
		if (this.receiver != null && this.receiver.equalsIgnoreCase(oldPlayerName)) {
			this.receiver = newPlayerName;
		}
	}
	
	@JsonIgnore
	public void extractPlayerNames(Set<String> playerNames) {
		if (this.defender != null) {
			playerNames.add(this.defender);
		}
		if (this.passer != null) {
			playerNames.add(this.passer);
		}
		if (this.receiver != null) {
			playerNames.add(this.receiver);
		}
	}

	public EventPosition getPos() {
		return pos;
	}

	public void setPos(EventPosition pos) {
		this.pos = pos;
	}

	public EventPosition getPosBegin() {
		return posBegin;
	}

	public void setPosBegin(EventPosition posBegin) {
		this.posBegin = posBegin;
	}

}
