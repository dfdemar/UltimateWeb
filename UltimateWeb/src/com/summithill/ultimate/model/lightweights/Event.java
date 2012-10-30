package com.summithill.ultimate.model.lightweights;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown=true)
public class Event {
	public static String OFFENSE = "Offense";
	public static String DEFENSE = "Defense";
	public static String GOAL = "Goal";
	public static String CATCH = "Catch";
	public static String D = "D";
	public static String DROP = "Drop";
	public static String THROWAWAY = "Throwaway";
	public static String PULL = "Pull";
	public static String PULL_OB = "PullOb";
	public static String DETAILS = "details";
	
	private String type;
	private String action;
	private String defender;
	private String passer;
	private String receiver;
	private EventDetails details;
	
	public String getType() {
		return type;
	}
	
	public boolean isGoal() {
		return action.equals(GOAL);
	}
	
	public boolean isOffense() {
		return type.equals(OFFENSE);
	}
	
	public boolean isDefense() {
		return ! this.isOffense();
	}
	
	public boolean isTurnover() {
		return this.isThrowaway() || this.isD();
	}
	
	public boolean isThrowaway() {
		return action.equals(THROWAWAY);
	}
	
	public boolean isD() {
		return action.equals(D);
	}
	
	public boolean isCatch() {
		return action.equals(CATCH);
	}
	
	public boolean isDrop() {
		return action.equals(DROP);
	}
	
	public boolean isPull() {
		return action.equals(PULL);
	}
	
	public boolean isPullOb() {
		return action.equals(PULL_OB);
	}
	
	public boolean isFirstOffenseEvent(Event previousEvent) {
		return this.isOffense() && (previousEvent == null || (previousEvent.isDefense()));
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
	public EventDetails getDetails() {
		return details;
	}
	public void setDetails(EventDetails details) {
		this.details = details;
	}
}
